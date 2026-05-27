import express from "express";
import path from "path";
import pg from "pg";
import { createServer as createViteServer } from "vite";

const { Pool } = pg;

// Supabase Connection Details (Falling back to values specified in config.php)
const pool = new Pool({
  host: process.env.SUPABASE_PG_HOST || "aws-0-eu-west-1.pooler.supabase.com",
  port: parseInt(process.env.SUPABASE_PG_PORT || "5432"),
  database: process.env.SUPABASE_PG_DATABASE || "postgres",
  user: process.env.SUPABASE_PG_USER || "postgres.xsujeeyrbhsijalvmarl",
  password: process.env.SUPABASE_PG_PASSWORD || "JbLuayZ0UKjzuxt2",
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDb() {
  try {
    // 1. Create Complains Table (denuncias) with PostgreSQL compatible definitions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS denuncias (
          id SERIAL PRIMARY KEY,
          codigo_rastreio VARCHAR(50) NOT NULL UNIQUE,
          tipo_burla VARCHAR(100) NOT NULL,
          descricao TEXT NOT NULL,
          numero_suspeito VARCHAR(50),
          valor_envolvido DECIMAL(12,2) DEFAULT 0.00,
          data_incidente DATE NOT NULL,
          email_denunciante VARCHAR(150),
          estado VARCHAR(50) DEFAULT 'Em Análise',
          ip_origem VARCHAR(45),
          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Alerts Table (alertas)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alertas (
          id SERIAL PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT NOT NULL,
          tipo VARCHAR(50) NOT NULL DEFAULT 'Alerta',
          ativo BOOLEAN DEFAULT TRUE,
          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed complaints if empty
    const countComplaintsResult = await pool.query("SELECT COUNT(*) FROM denuncias");
    if (parseInt(countComplaintsResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO denuncias (codigo_rastreio, tipo_burla, descricao, numero_suspeito, valor_envolvido, data_incidente, email_denunciante, estado) VALUES
        ('SDB-2026-X83F1', 'M-Pesa/E-Mola', 'Recebi uma chamada de um indivíduo que se identificou como funcionário da Vodacom, dizendo que a minha conta M-Pesa seria bloqueada se eu não digitasse o código *150# e executasse uma transferência para o número listado. Acabei perdendo 5.000 MZN.', '841234567', 5000.00, '2026-05-10', 'vitima1@gmail.com', 'Em Investigação'),
        ('SDB-2026-Z44B9', 'Redes Sociais', 'Perfil falso no Facebook vendendo computadores portáteis seminovos abaixo do preço. Enviei o sinal de 3.500 MZN por M-Pesa e o vendedor bloqueou-me logo a seguir.', '857654321', 3500.00, '2026-05-18', NULL, 'Em Análise'),
        ('SDB-2026-W11A5', 'Phishing', 'SMS imitando o banco Millennium BIM com um link clicável contendo "actualizacao-bim-mz". O link pede chaves de acesso ao NetBanking. Não cheguei a abrir mas denuncio o link.', NULL, 0.00, '2026-05-22', 'denunciante_anon@gmail.com', 'Confirmada')
      `);
      console.log("Database seeded with baseline complaints.");
    }

    // Seed alerts if empty
    const countAlertsResult = await pool.query("SELECT COUNT(*) FROM alertas");
    if (parseInt(countAlertsResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO alertas (titulo, descricao, tipo, ativo) VALUES
        ('Falso prémio M-Pesa de 50.000 MZN', 'Cuidado com SMS provenientes de números individuais alegando que ganhou um prémio M-Pesa da Vodacom. A Vodacom só contacta através de canais oficiais.', 'Alerta', true),
        ('Falsas vagas de emprego na Electricidade de Moçambique (EDM)', 'Campanhas de phishing estão a circular nas redes sociais e WhatsApp, direcionando para um formulário fraudulento que pede dinheiro para prosseguir com o processo de seleção.', 'Alerta', true),
        ('Website Falso: sdb-mz-login-fake.com', 'Detetamos uma tentativa de simulação do nosso painel. Lembre-se de certificar-se que a URL correta termina no endereço oficial do seu alojamento.', 'Website Falso', true)
      `);
      console.log("Database seeded with baseline alerts.");
    }
  } catch (err) {
    console.error("Postgres startup database initialize/seed error:", err);
  }
}

async function startServer() {
  await initDb();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === API ENDPOINTS FOR COMPLAINTS (DENUNCIAS) ===

  // GET /api/denuncias - Get all complaints
  app.get("/api/denuncias", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM denuncias ORDER BY id DESC");
      const list = result.rows.map((row) => ({
        ...row,
        id: row.id.toString(),
        valor_envolvido: row.valor_envolvido ? parseFloat(row.valor_envolvido) : 0,
        data_incidente: row.data_incidente instanceof Date ? row.data_incidente.toISOString().split("T")[0] : row.data_incidente,
      }));
      res.json(list);
    } catch (err: any) {
      console.error("GET /api/denuncias error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/denuncias - Create a new complaint
  app.post("/api/denuncias", async (req, res) => {
    try {
      const {
        codigo_rastreio,
        tipo_burla,
        descricao,
        numero_suspeito,
        valor_envolvido,
        data_incidente,
        email_denunciante,
        estado,
        ip_origem,
      } = req.body;

      const result = await pool.query(
        `INSERT INTO denuncias (codigo_rastreio, tipo_burla, descricao, numero_suspeito, valor_envolvido, data_incidente, email_denunciante, estado, ip_origem)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          codigo_rastreio,
          tipo_burla,
          descricao,
          numero_suspeito || null,
          valor_envolvido || 0,
          data_incidente,
          email_denunciante || null,
          estado || "Em Análise",
          ip_origem || req.ip,
        ]
      );

      const row = result.rows[0];
      res.status(201).json({
        ...row,
        id: row.id.toString(),
        valor_envolvido: parseFloat(row.valor_envolvido),
        data_incidente: row.data_incidente instanceof Date ? row.data_incidente.toISOString().split("T")[0] : row.data_incidente,
      });
    } catch (err: any) {
      console.error("POST /api/denuncias error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /api/denuncias/:id - Update the status/details of a complaint
  app.put("/api/denuncias/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const result = await pool.query(
        `UPDATE denuncias SET estado = $1, data_atualizacao = NOW() WHERE id = $2 RETURNING *`,
        [estado, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Denúncia não encontrada" });
      }

      const row = result.rows[0];
      res.json({
        ...row,
        id: row.id.toString(),
        valor_envolvido: parseFloat(row.valor_envolvido),
        data_incidente: row.data_incidente instanceof Date ? row.data_incidente.toISOString().split("T")[0] : row.data_incidente,
      });
    } catch (err: any) {
      console.error("PUT /api/denuncias error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/denuncias/:id - Delete a complaint
  app.delete("/api/denuncias/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("DELETE FROM denuncias WHERE id = $1 RETURNING *", [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Denúncia não encontrada" });
      }

      res.json({ success: true, message: "Denúncia removida com sucesso" });
    } catch (err: any) {
      console.error("DELETE /api/denuncias error:", err);
      res.status(500).json({ error: err.message });
    }
  });


  // === API ENDPOINTS FOR ALERTS (ALERTAS) ===

  // GET /api/alertas - Get all public alerts
  app.get("/api/alertas", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM alertas ORDER BY id DESC");
      const list = result.rows.map((row) => ({
        ...row,
        id: row.id.toString(),
      }));
      res.json(list);
    } catch (err: any) {
      console.error("GET /api/alertas error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/alertas - Create a new alert
  app.post("/api/alertas", async (req, res) => {
    try {
      const { titulo, descricao, tipo, ativo } = req.body;
      const result = await pool.query(
        "INSERT INTO alertas (titulo, descricao, tipo, ativo) VALUES ($1, $2, $3, $4) RETURNING *",
        [titulo, descricao, tipo || "Alerta", ativo !== undefined ? ativo : true]
      );

      const row = result.rows[0];
      res.status(201).json({
        ...row,
        id: row.id.toString(),
      });
    } catch (err: any) {
      console.error("POST /api/alertas error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /api/alertas/:id - Toggle/update alert details
  app.put("/api/alertas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { ativo, titulo, descricao, tipo } = req.body;

      // Allow updating multiple fields or just toggle 'ativo'
      let queryStr = "";
      let params: any[] = [];

      if (ativo !== undefined && titulo !== undefined) {
        queryStr = "UPDATE alertas SET ativo = $1, titulo = $2, descricao = $3, tipo = $4 WHERE id = $5 RETURNING *";
        params = [ativo, titulo, descricao, tipo, id];
      } else if (ativo !== undefined) {
        queryStr = "UPDATE alertas SET ativo = $1 WHERE id = $2 RETURNING *";
        params = [ativo, id];
      } else {
        return res.status(400).json({ error: "Parâmetros insuficientes para atualização" });
      }

      const result = await pool.query(queryStr, params);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Alerta não encontrado" });
      }

      const row = result.rows[0];
      res.json({
        ...row,
        id: row.id.toString(),
      });
    } catch (err: any) {
      console.error("PUT /api/alertas error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/alertas/:id - Delete an alert
  app.delete("/api/alertas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("DELETE FROM alertas WHERE id = $1 RETURNING *", [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Alerta não encontrado" });
      }

      res.json({ success: true, message: "Alerta removido com sucesso" });
    } catch (err: any) {
      console.error("DELETE /api/alertas error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // === EXPORTS / COMPATIBILITY ENDPOINTS ===
  // Healthcheck endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "PHP/React Fullstack Core online integration" });
  });

  // Serve Vite Frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server listening on HTTP Port ${PORT}`);
  });
}

startServer();
