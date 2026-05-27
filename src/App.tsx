import React, { useState, useEffect } from "react";
import { 
  Shield, 
  PlusCircle, 
  Search, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Wallet, 
  Radio, 
  Key, 
  LogOut, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  Upload,
  Download, 
  Eye, 
  FileSpreadsheet, 
  Lock, 
  RefreshCw,
  Phone,
  Calendar,
  Layers,
  HelpCircle,
  Megaphone,
  UserCheck,
  Globe,
  Plus,
  Info,
  BookOpen,
  Smartphone,
  TrendingUp,
  ShoppingBag
} from "lucide-react";

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Denuncia {
  id: string;
  codigo_rastreio: string;
  tipo_burla: string;
  descricao: string;
  numero_suspeito: string;
  valor_envolvido: number;
  data_incidente: string;
  email_denunciante: string;
  estado: "Em Análise" | "Confirmada" | "Em Investigação" | "Resolvida" | "Rejeitada";
  urgencia: "Alta" | "Média" | "Baixa";
  ip_origem: string;
  data_criacao: string;
  data_atualizacao: string;
  anexo_nome?: string;
  anexo_tamanho?: string;
  anexo_tipo?: string;
}

interface Alerta {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "Alerta" | "Website Falso" | "Número Suspeito";
  ativo: boolean;
  data_criacao: string;
}

// ==========================================
// SEMENTES INICIAIS (SEED DATA)
// ==========================================
const SEMENTES_DENUNCIAS: Denuncia[] = [
  {
    id: "1",
    codigo_rastreio: "SDB-2026-X83F1",
    tipo_burla: "M-Pesa/E-Mola",
    descricao: "Recebi um SMS notificando que ganhei um prémio de 50.000 MZN da Vodacom. Liguei de volta e pediram para eu digitar *150# e fazer uma transferência como taxa de ativação preventiva de 5.000 MZN. Após enviar, o número ficou inacessível.",
    numero_suspeito: "841234567",
    valor_envolvido: 5000,
    data_incidente: "2026-05-10",
    email_denunciante: "vitima_anonima@gmail.com",
    estado: "Em Investigação",
    urgencia: "Alta",
    ip_origem: "197.249.4.18",
    data_criacao: "2026-05-10T14:22:00Z",
    data_atualizacao: "2026-05-11T09:30:00Z",
    anexo_nome: "Screenshot_SMS_Vodacom_Fake.png",
    anexo_tamanho: "1.4 MB",
    anexo_tipo: "image/png"
  },
  {
    id: "2",
    codigo_rastreio: "SDB-2026-Z44B9",
    tipo_burla: "Redes Sociais",
    descricao: "Um perfil duplicado da minha mãe no Facebook enviou-me mensagens urgentes alegando que precisava de comprar medicação urgente mas o seu aplicativo bancário estava travado. Enviei 3.500 MZN por M-Pesa. Mais tarde liguei à minha mãe verdadeira e descobri que a conta foi invadida.",
    numero_suspeito: "857654321",
    valor_envolvido: 3500,
    data_incidente: "2026-05-18",
    email_denunciante: "",
    estado: "Em Análise",
    urgencia: "Média",
    ip_origem: "197.249.22.45",
    data_criacao: "2026-05-18T09:15:00Z",
    data_atualizacao: "2026-05-18T09:15:00Z",
    anexo_nome: "Conversa_Facebook_Messenger.pdf",
    anexo_tamanho: "2.1 MB",
    anexo_tipo: "application/pdf"
  },
  {
    id: "3",
    codigo_rastreio: "SDB-2026-W11A5",
    tipo_burla: "Phishing",
    descricao: "Recebi SMS com link rotulado 'actualizacao-bim-mz.com' alegando que o meu código de NetBanking do Millennium BIM iria expirar hoje. Ao clicar no link, pedia a assinatura eletrónica e PIN de acesso. Percebi que era um site falso copiando a logomarca do banco.",
    numero_suspeito: "829551421",
    valor_envolvido: 0,
    data_incidente: "2026-05-22",
    email_denunciante: "denunciante_prevenido@gmail.com",
    estado: "Confirmada",
    urgencia: "Baixa",
    ip_origem: "102.219.144.11",
    data_criacao: "2026-05-22T19:05:00Z",
    data_atualizacao: "2026-05-23T15:10:00Z",
    anexo_nome: "sms-bim-fake.webp",
    anexo_tamanho: "480 KB",
    anexo_tipo: "image/webp"
  }
];

const SEMENTES_ALERTAS: Alerta[] = [
  {
    id: "1",
    titulo: "Falso prémio M-Pesa de 50.000 MZN",
    descricao: "Cuidado com SMS provenientes de números individuais alegando que ganhou um prémio M-Pesa da Vodacom. A Vodacom só contacta através do número de serviço oficial.",
    tipo: "Alerta",
    ativo: true,
    data_criacao: "2026-05-24T18:30:00Z"
  },
  {
    id: "2",
    titulo: "Falsas vagas de emprego na EDM",
    descricao: "Campanhas de phishing no WhatsApp direcionando para um formulário fraudulento que pede dinheiro no processo de seleção do suposto recrutamento para a Electricidade de Moçambique.",
    tipo: "Alerta",
    ativo: true,
    data_criacao: "2026-05-23T11:00:00Z"
  },
  {
    id: "3",
    titulo: "Website Falso: sdb-mz-login-fake.site",
    descricao: "Detetamos uma tentativa de simulação do nosso painel. Lembre-se de certificar-se que a URL correta termina no endereço oficial do seu alojamento.",
    tipo: "Website Falso",
    ativo: true,
    data_criacao: "2026-05-22T14:45:00Z"
  }
];

export default function App() {
  // ==========================================
  // CORE STATES (LOCAL STORAGE SINK & SUPABASE SYNC)
  // ==========================================
  const [denuncias, setDenuncias] = useState<Denuncia[]>(() => {
    const saved = localStorage.getItem("sdb_mz_denuncias");
    return saved ? JSON.parse(saved) : SEMENTES_DENUNCIAS;
  });

  const [alertas, setAlertas] = useState<Alerta[]>(() => {
    const saved = localStorage.getItem("sdb_mz_alertas");
    return saved ? JSON.parse(saved) : SEMENTES_ALERTAS;
  });

  const [page, setPage] = useState<"landing" | "denunciar" | "acompanhar" | "confirmacao" | "biblioteca" | "estatisticas">("landing");
  const [activeBlacklistPhone, setActiveBlacklistPhone] = useState<string | null>(null);
  
  // Flash notifications state
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state with Database on page load
  useEffect(() => {
    const fetchDBData = async () => {
      try {
        const dRes = await fetch("/api/denuncias");
        if (dRes.ok) {
          const dData = await dRes.json();
          setDenuncias(dData);
        }
      } catch (err) {
        console.error("Erro ao carregar denúncias do Supabase:", err);
      }

      try {
        const aRes = await fetch("/api/alertas");
        if (aRes.ok) {
          const aData = await aRes.json();
          setAlertas(aData);
        }
      } catch (err) {
        console.error("Erro ao carregar alertas do Supabase:", err);
      }
    };
    fetchDBData();
  }, []);

  useEffect(() => {
    localStorage.setItem("sdb_mz_denuncias", JSON.stringify(denuncias));
  }, [denuncias]);

  useEffect(() => {
    localStorage.setItem("sdb_mz_alertas", JSON.stringify(alertas));
  }, [alertas]);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // ==========================================
  // FORM REPORT STATE (ANONYMOUS FILER)
  // ==========================================
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    tipo_burla: "",
    descricao: "",
    numero_suspeito: "",
    valor_envolvido: "",
    data_incidente: new Date().toISOString().split('T')[0],
    email_denunciante: "",
    confirma_verdade: false,
    urgencia: "Média" as "Alta" | "Média" | "Baixa",
    anonimo: true,
    chk_bloqueado: false,
    chk_avisado: false,
    chk_contactado: false,
    chk_veridicas: false
  });
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [newlyCreatedCode, setNewlyCreatedCode] = useState("");

  // ==========================================
  // TRACKING SEARCH STATE
  // ==========================================
  const [trackingCodeQuery, setTrackingCodeQuery] = useState("");
  const [searchPhoneQuery, setSearchPhoneQuery] = useState("");
  const [acompanharTab, setAcompanharTab] = useState<"code" | "phone">("code");
  const [foundComplaint, setFoundComplaint] = useState<Denuncia | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamic calculations for reported suspicious phone numbers
  const getPhoneStats = (phone: string) => {
    const trimmed = phone.trim().replace(/[\s\-\+\(\)]/g, "");
    if (!trimmed) return { count: 0, mostFrequentType: "Nenhum", list: [] };

    const list = denuncias.filter(d => {
      const suspectClean = (d.numero_suspeito || "").trim().replace(/[\s\-\+\(\)]/g, "");
      return suspectClean !== "" && (suspectClean.endsWith(trimmed) || trimmed.endsWith(suspectClean));
    });

    const counts: Record<string, number> = {};
    list.forEach(d => {
      counts[d.tipo_burla] = (counts[d.tipo_burla] || 0) + 1;
    });

    let mostFrequentType = "Não identificado";
    let maxCount = 0;
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentType = type;
      }
    });

    return {
      count: list.length,
      mostFrequentType,
      list
    };
  };

  // ==========================================
  // ADMIN CONTROL STATES
  // ==========================================
  const [adminUser, setAdminUser] = useState({ email: "", password: "" });
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Denuncia | null>(null);
  
  // Admin dashboard view mode: 'denuncias' | 'alertas' | 'numeros'
  const [adminSubTab, setAdminSubTab] = useState<"denuncias" | "alertas" | "numeros">("denuncias");
  
  // Filters state
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchFilterKeyword, setSearchFilterKeyword] = useState("");

  // Alert Creation state
  const [newAlertForm, setNewAlertForm] = useState({
    titulo: "",
    descricao: "",
    tipo: "Alerta" as "Alerta" | "Website Falso" | "Número Suspeito"
  });

  // ==========================================
  // EVENT HANDLERS
  // ==========================================
  
  // Handle File Drop Simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 5) {
      showNotification("O ficheiro excede o limite máximo permitido de 5MB.", "error");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      showNotification("Tipo de ficheiro inválido. Envie imagens ou PDFs.", "error");
      return;
    }
    
    setUploadedFile({
      name: file.name,
      size: `${sizeInMB.toFixed(2)} MB`,
      type: file.type
    });
    showNotification("Anexo verificado e anexado à denúncia!");
  };

  // Submit report
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chk_bloqueado || !formData.chk_avisado || !formData.chk_contactado || !formData.chk_veridicas) {
      showNotification("Deve preencher e confirmar todos os itens da checklist de segurança.", "error");
      return;
    }
    if (formData.descricao.length < 15) {
      showNotification("Por favor, descreva o incidente detalhadamente (no mínimo 15 caracteres).", "error");
      return;
    }

    // Generate random code SDB-2026-RXXXX
    const randStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `SDB-2026-${randStr}`;

    const newDenunciaPayload = {
      codigo_rastreio: code,
      tipo_burla: formData.tipo_burla,
      descricao: formData.descricao,
      numero_suspeito: formData.numero_suspeito,
      valor_envolvido: formData.valor_envolvido ? parseFloat(formData.valor_envolvido) : 0,
      data_incidente: formData.data_incidente,
      email_denunciante: formData.anonimo ? "" : formData.email_denunciante,
      estado: "Em Análise" as "Em Análise" | "Em Investigação" | "Confirmada" | "Rejeitada" | "Resolvida",
      urgencia: formData.urgencia,
      ip_origem: `197.249.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    };

    let savedDenuncia: Denuncia | null = null;

    try {
      const response = await fetch("/api/denuncias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDenunciaPayload),
      });

      if (response.ok) {
        const createdDenuncia = await response.json();
        setDenuncias([createdDenuncia, ...denuncias]);
        setNewlyCreatedCode(code);
        savedDenuncia = createdDenuncia;
        showNotification("Denúncia anónima guardada no Supabase com sucesso!");
      } else {
        throw new Error("Erro de resposta do servidor.");
      }
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackDenuncia: Denuncia = {
        id: (denuncias.length + 1).toString(),
        ...newDenunciaPayload,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
        anexo_nome: uploadedFile?.name,
        anexo_tamanho: uploadedFile?.size,
        anexo_tipo: uploadedFile?.type
      };
      setDenuncias([fallbackDenuncia, ...denuncias]);
      setNewlyCreatedCode(code);
      savedDenuncia = fallbackDenuncia;
      showNotification("Guardado localmente (erro ao ligar ao Supabase).", "error");
    }

    // 1. Auto-Alerta por Reincidência
    const trimmedNum = formData.numero_suspeito?.trim();
    if (trimmedNum && trimmedNum.length >= 8) {
      // Find how many reports already exist for this number
      const countExisting = denuncias.filter(d => d.numero_suspeito?.trim() === trimmedNum).length;
      // If there are already 2 or more reports in state, adding the 3rd triggers the auto-alert!
      if (countExisting >= 2) {
        const alertPayload = {
          titulo: `Número Reincidente: ${trimmedNum}`,
          descricao: `ALERTA DE REINCIDÊNCIA: O número +258 ${trimmedNum} foi reportado ${countExisting + 1} vezes por burlas do tipo "${formData.tipo_burla || "Fraude"}". Tenha extremo cuidado com ligações deste remetente.`,
          tipo: "Número Suspeito" as "Alerta" | "Website Falso" | "Número Suspeito",
          ativo: true
        };

        try {
          const alertResponse = await fetch("/api/alertas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alertPayload)
          });
          if (alertResponse.ok) {
            const createdAlert = await alertResponse.json();
            setAlertas(prev => [createdAlert, ...prev]);
            showNotification(`Alerta Automático gerado para o número reincidente ${trimmedNum}!`, "error");
          }
        } catch (alertErr) {
          console.error("Erro ao disparar Auto-Alerta reincidente:", alertErr);
          // Fallback alert insertion in state
          const fallbackAlert = {
            id: (alertas.length + 1).toString(),
            ...alertPayload,
            data_criacao: new Date().toISOString()
          };
          setAlertas(prev => [fallbackAlert, ...prev]);
        }
      }
    }
    
    // Clear Form Setup and Stepper
    setFormStep(1);
    setFormData({
      tipo_burla: "",
      descricao: "",
      numero_suspeito: "",
      valor_envolvido: "",
      data_incidente: new Date().toISOString().split('T')[0],
      email_denunciante: "",
      confirma_verdade: false,
      urgencia: "Média",
      anonimo: true,
      chk_bloqueado: false,
      chk_avisado: false,
      chk_contactado: false,
      chk_veridicas: false
    });
    setUploadedFile(null);

    setPage("confirmacao");
  };

  // Search report by code
  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = trackingCodeQuery.trim().toUpperCase();
    const match = denuncias.find(d => d.codigo_rastreio === sanitized);
    if (match) {
      setFoundComplaint(match);
      setHasSearched(true);
    } else {
      setFoundComplaint(null);
      setHasSearched(true);
      showNotification("Nenhuma correspondência encontrada. Verifique o código.", "error");
    }
  };

  // Search reports by phone number
  const handleSearchPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhoneQuery.trim()) {
      showNotification("Por favor, introduza um número válido.", "error");
      return;
    }
    setHasSearched(true);
    showNotification("Pesquisa de número efetuada na base pública.");
  };

  // Admin login process
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.email === "admin@sdb.co.mz" && adminUser.password === "admin123") {
      setAdminLoggedIn(true);
      setPage("admin_dashboard");
      showNotification("Início de sessão administrativa com sucesso!");
    } else {
      showNotification("Credenciais de administrador inválidas.", "error");
    }
  };

  // Quick select category from scam cards
  const selectCategoryFromCard = (category: string) => {
    setFormData(prev => ({ ...prev, tipo_burla: category }));
    setPage("denunciar");
  };

  // Public resolve own complaint function
  const handleResolveComplaint = async (id: string) => {
    try {
      const response = await fetch(`/api/denuncias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: "Resolvida" })
      });

      if (response.ok) {
        const updatedReportFromDb = await response.json();
        const updated = denuncias.map(d => d.id === id ? updatedReportFromDb : d);
        setDenuncias(updated);
        // Sync local trackers
        if (foundComplaint && foundComplaint.id === id) {
          setFoundComplaint(updatedReportFromDb);
        }
        showNotification("Denúncia marcada como Resolvida com sucesso! Obrigado.", "success");
      } else {
        throw new Error("Erro ao salvar.");
      }
    } catch (err) {
      console.error(err);
      const updated = denuncias.map(d => d.id === id ? { ...d, estado: "Resolvida" as const, data_atualizacao: new Date().toISOString() } : d);
      setDenuncias(updated);
      const matched = updated.find(d => d.id === id);
      if (matched) setFoundComplaint(matched);
      showNotification("Denúncia marcada como Resolvida localmente.", "success");
    }
  };

  // Update complaint status as admin
  const updateComplaintStatus = async (newStatus: Denuncia["estado"]) => {
    if (!selectedReport) return;
    try {
      const response = await fetch(`/api/denuncias/${selectedReport.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: newStatus })
      });

      if (response.ok) {
        const updatedReportFromDb = await response.json();
        const updated = denuncias.map(d => d.id === selectedReport.id ? updatedReportFromDb : d);
        setDenuncias(updated);
        setSelectedReport(updatedReportFromDb);
        showNotification(`Estado alterado no Supabase para: ${newStatus}`);
      } else {
        throw new Error("Erro ao atualizar no Supabase.");
      }
    } catch (err) {
      console.error(err);
      const updated = denuncias.map(d => {
        if (d.id === selectedReport.id) {
          return {
            ...d,
            estado: newStatus,
            data_atualizacao: new Date().toISOString()
          };
        }
        return d;
      });
      setDenuncias(updated);
      const freshData = updated.find(d => d.id === selectedReport.id);
      if (freshData) setSelectedReport(freshData);
      showNotification(`Estado alterado localmente (erro Supabase).`, "error");
    }
  };

  // Exclude case file as admin
  const deleteCaseFile = async (id: string) => {
    if (confirm("Tem a certeza absoluta de que quer excluir esta denúncia? Esta ação é irreversível.")) {
      try {
        const response = await fetch(`/api/denuncias/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          const remaining = denuncias.filter(d => d.id !== id);
          setDenuncias(remaining);
          setSelectedReport(null);
          setPage("admin_dashboard");
          showNotification("Registo de queixa permanentemente excluído do Supabase.", "success");
        } else {
          throw new Error("Erro ao apagar.");
        }
      } catch (err) {
        console.error(err);
        const remaining = denuncias.filter(d => d.id !== id);
        setDenuncias(remaining);
        setSelectedReport(null);
        setPage("admin_dashboard");
        showNotification("Queixa excluída localmente (erro Supabase).", "error");
      }
    }
  };

  // Create new public alert as admin
  const handleCreateAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertForm.titulo || !newAlertForm.descricao) {
      showNotification("Por favor, preencha todos os campos obrigatórios.", "error");
      return;
    }

    const alertPayload = {
      titulo: newAlertForm.titulo,
      descricao: newAlertForm.descricao,
      tipo: newAlertForm.tipo,
      ativo: true
    };

    try {
      const response = await fetch("/api/alertas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(alertPayload)
      });

      if (response.ok) {
        const createdAlert = await response.json();
        setAlertas([createdAlert, ...alertas]);
        showNotification("Novo alerta público lançado e salvo no Supabase!");
      } else {
        throw new Error("Erro do servidor.");
      }
    } catch (err) {
      console.error(err);
      const newAlert: Alerta = {
        id: (alertas.length + 1).toString(),
        ...alertPayload,
        data_criacao: new Date().toISOString()
      };
      setAlertas([newAlert, ...alertas]);
      showNotification("Alerta criado localmente (erro Supabase).", "error");
    }

    setNewAlertForm({ titulo: "", descricao: "", tipo: "Alerta" });
  };

  // Toggle alert activity
  const toggleAlertActivity = async (id: string) => {
    const targetAlert = alertas.find(a => a.id === id);
    if (!targetAlert) return;

    const newAtivo = !targetAlert.ativo;

    try {
      const response = await fetch(`/api/alertas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ativo: newAtivo })
      });

      if (response.ok) {
        const updatedAlert = await response.json();
        setAlertas(alertas.map(a => a.id === id ? updatedAlert : a));
        showNotification("Estado do alerta alterado no Supabase.");
      } else {
        throw new Error("Erro");
      }
    } catch (err) {
      console.error(err);
      setAlertas(alertas.map(a => {
        if (a.id === id) {
          return { ...a, ativo: !a.ativo };
        }
        return a;
      }));
      showNotification("Estado alterado localmente (erro Supabase).", "error");
    }
  };

  // Delete public alert
  const deletePublicAlert = async (id: string) => {
    if (confirm("Quer de facto apagar este alerta?")) {
      try {
        const response = await fetch(`/api/alertas/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          setAlertas(alertas.filter(a => a.id !== id));
          showNotification("Alerta de burla permanentemente removido do Supabase.", "success");
        } else {
          throw new Error("Erro");
        }
      } catch (err) {
        console.error(err);
        setAlertas(alertas.filter(a => a.id !== id));
        showNotification("Alerta excluído localmente (erro Supabase).", "error");
      }
    }
  };

  // Format money
  const formatMZN = (val: number) => {
    return new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(val);
  };

  // Helper count status colors for badges
  const getBadgeClass = (state: Denuncia["estado"]) => {
    switch (state) {
      case "Em Análise": return "bg-slate-100 text-slate-700 border border-slate-300";
      case "Confirmada": return "bg-amber-100 text-amber-800 border border-amber-300";
      case "Em Investigação": return "bg-sky-100 text-sky-800 border border-sky-300";
      case "Resolvida": return "bg-green-100 text-green-800 border border-green-300";
      case "Rejeitada": return "bg-red-100 text-red-800 border border-red-300";
    }
  };

  // Calculate statistics
  const totalReportsCount = denuncias.length;
  const underAnalysisCount = denuncias.filter(d => d.estado === "Em Análise").length;
  const underInvestigationCount = denuncias.filter(d => d.estado === "Em Investigação").length;
  const resolvedCount = denuncias.filter(d => d.estado === "Resolvida").length;
  const totalValueLost = denuncias.reduce((acc, curr) => acc + curr.valor_envolvido, 0);

  // Grouped unique phone numbers with report count
  const phoneRanking = React.useMemo(() => {
    const counts: { [phone: string]: { oco: number; tipo: string; last: string } } = {};
    denuncias.forEach(d => {
      if (d.numero_suspeito && d.numero_suspeito.trim() !== "") {
        const ph = d.numero_suspeito.trim();
        if (counts[ph]) {
          counts[ph].oco += 1;
        } else {
          counts[ph] = { oco: 1, tipo: d.tipo_burla, last: d.data_incidente };
        }
      }
    });
    return Object.entries(counts)
      .map(([number, meta]) => ({ number, ...meta }))
      .sort((a, b) => b.oco - a.oco);
  }, [denuncias]);

  // Grouped types of scam counts for charts
  const typeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      "M-Pesa/E-Mola": 0,
      "Redes Sociais": 0,
      "Phishing": 0,
      "Falso Investimento": 0,
      "Comércio Online": 0,
      "Outro": 0
    };
    denuncias.forEach(d => {
      if (counts[d.tipo_burla] !== undefined) {
        counts[d.tipo_burla]++;
      } else {
        counts["Outro"]++;
      }
    });
    return counts;
  }, [denuncias]);

  // Handle Simulated CSV Export
  const triggerSimulationCSVExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for excel accents
    csvContent += "ID;Codigo Rastreio;Tipo de Burla;Descricao;Numero Suspeito;Valor Envolvido (MZN);Data;Email;Estado;Origem IP\n";
    
    denuncias.forEach(d => {
      const row = [
        d.id,
        d.codigo_rastreio,
        `"${d.tipo_burla}"`,
        `"${d.descricao.replace(/"/g, '""')}"`,
        d.numero_suspeito || "N/A",
        d.valor_envolvido,
        d.data_incidente,
        d.email_denunciante || "Anonimo",
        d.estado,
        d.ip_origem
      ].join(";");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SDB_MZ_Denuncias_Export_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Ficheiro CSV gerado e descarregado!");
  };

  // Filter list results
  const filteredReportsList = denuncias.filter(d => {
    const matchesType = filterType === "" || d.tipo_burla === filterType;
    const matchesStatus = filterStatus === "" || d.estado === filterStatus;
    const searchMatch = searchFilterKeyword === "" || 
      d.codigo_rastreio.toLowerCase().includes(searchFilterKeyword.toLowerCase()) ||
      d.descricao.toLowerCase().includes(searchFilterKeyword.toLowerCase()) ||
      d.numero_suspeito.includes(searchFilterKeyword) ||
      d.email_denunciante.toLowerCase().includes(searchFilterKeyword.toLowerCase());
    return matchesType && matchesStatus && searchMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      
      {/* Dynamic Alarm Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-700 via-amber-500 to-red-700 shadow-sm" />

      {/* Real-time Dynamic Notification Overlay */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 text-white py-3 px-5 rounded-lg shadow-xl flex items-center gap-3 transition-all duration-300 animate-fade-in ${
          notification.type === "success" ? "bg-emerald-700" : "bg-red-700"
        }`}>
          {notification.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-100" /> : <AlertTriangle className="w-5 h-5 text-red-100" />}
          <span className="font-medium text-sm">{notification.text}</span>
        </div>
      )}

      {/* Main Global Header Navigation with Animated Glowing Red Bar */}
      <div className="h-[4px] bg-gradient-to-r from-red-600 via-red-500 to-red-650 w-full animate-pulse z-50 sticky top-0" />
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-[4px] z-40 shadow-sm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => setPage("landing")} 
            className="flex items-center gap-3 group text-left cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <div className="p-2 bg-red-950/60 border border-red-500/30 rounded-lg text-red-500 font-bold flex items-center shadow-md">
              <Shield className="w-6 h-6 text-red-600 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight block leading-tight text-white font-sans">SDB-MZ</span>
              <span className="text-[10px] text-zinc-400 block tracking-wider uppercase font-mono">Defesa e Cidadania Digital</span>
            </div>
          </button>

          {/* Quick Menu */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setPage("biblioteca");
              }} 
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all cursor-pointer ${
                page === "biblioteca" ? "bg-red-950/60 text-red-500 border-red-550/40" : "bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <HelpCircle className="w-4 h-4 text-red-500" />
              <span>Biblioteca</span>
            </button>

            <button 
              onClick={() => {
                setHasSearched(false);
                setTrackingCodeQuery("");
                setFoundComplaint(null);
                setAcompanharTab("code");
                setPage("acompanhar");
              }} 
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all cursor-pointer ${
                page === "acompanhar" ? "bg-red-950/60 text-red-500 border-red-550/40" : "bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Acompanhar</span>
            </button>

            <button 
              onClick={() => {
                setPage("estatisticas");
              }} 
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all cursor-pointer ${
                page === "estatisticas" ? "bg-red-950/60 text-red-500 border-red-550/40" : "bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span>Estatísticas</span>
            </button>
            
            <button 
              onClick={() => {
                setFormStep(1);
                setPage("denunciar");
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-black rounded-full transition-all cursor-pointer ${
                page === "denunciar" ? "bg-red-600 text-white shadow-lg shadow-red-500/20" : "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/10"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Denunciar</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE BODY RENDER */}
      <main className="flex-1 bg-zinc-950 text-zinc-100">
        
        {/* ==================================================================== */}
        {/* 1. VIEW LANDING PAGE */}
        {/* ==================================================================== */}
        {page === "landing" && (
          <div className="animate-in fade-in duration-300">
            {/* Hero Section Redesigned */}
            <section className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#1e0a0a]/30 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-zinc-800">
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-950/20 blur-[100px] rounded-full translate-x-12 -translate-y-12 animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-zinc-900/40 blur-[120px] rounded-full" />
              
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-red-950/80 text-red-500 border border-red-500/30 rounded-full uppercase tracking-widest mb-6 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-550 animate-ping inline-block" />
                      Iniciativa Cidadã
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 select-none">
                      Denuncie. Proteja.<br />
                      <span className="text-red-650 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">MOÇAMBIQUE.</span>
                    </h1>
                    <p className="text-zinc-300 text-base sm:text-lg mb-8 max-w-2xl leading-relaxed">
                      A plataforma nacional de triagem 100% anónima para monitorar, reportar e combater cibercrimes, fraudes eletrónicas e burlas de pagamentos móveis em Moçambique.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => {
                          setFormStep(1);
                          setPage("denunciar");
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-full text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-red-950/40 cursor-pointer"
                      >
                        <Megaphone className="w-5 h-5 text-white" />
                        <span>FAZER DENÚNCIA AGORA</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setHasSearched(false);
                          setTrackingCodeQuery("");
                          setFoundComplaint(null);
                          setAcompanharTab("code");
                          setPage("acompanhar");
                        }}
                        className="bg-transparent hover:bg-white/5 text-zinc-200 font-bold px-8 py-4 rounded-full text-base border border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Search className="w-5 h-5 text-zinc-400" />
                        <span>Acompanhar Código</span>
                      </button>
                    </div>
                  </div>

                  {/* Glassmorphic Stats Panel Widget */}
                  <div className="lg:col-span-5">
                    <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl p-6 border border-zinc-800 text-zinc-100 shadow-xl">
                      <h4 className="font-extrabold text-lg mb-4 flex items-center gap-2 text-white">
                        <UserCheck className="w-5 h-5 text-red-500" />
                        <span>Preservação de Anonimato Absoluto</span>
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                        Nenhum login, credencial, e-mail ou identificador é obrigatório para denunciar. Nenhuma informação pessoal ou IP de identificação direta é correlacionada a si nas nossas bases públicas.
                      </p>
                      
                      <div className="h-px bg-zinc-800 my-4" />
                      
                      <div className="grid grid-cols-2 gap-4 text-center mb-4">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <span className="text-2xl sm:text-3xl font-black text-red-500 block font-mono">
                            {denuncias.length}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Casos Integrados</span>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <span className="text-2xl sm:text-3xl font-black text-emerald-500 block font-mono">
                            {denuncias.filter(d => d.estado === "Resolvida").length}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Casos Resolvidos</span>
                        </div>
                      </div>

                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 text-center">
                        <span className="text-xl sm:text-2xl font-black text-red-405 block font-mono">
                          {formatMZN(totalValueLost)}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Burlas Prejuízo Acumulado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Live Warnings/Alerts Section */}
            {alertas.filter(a => a.ativo).length > 0 && (
              <section className="bg-amber-950/20 border-b border-zinc-800 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="p-1 px-3 bg-red-650 text-white font-extrabold text-xs rounded-full uppercase flex items-center gap-1 font-mono">
                      <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> EMERGÊNCIA
                    </span>
                    <h3 className="font-black text-sm sm:text-base text-zinc-100 uppercase tracking-widest">Alertas de Fraudes Ativas</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {alertas.filter(a => a.ativo).slice(0, 3).map(al => (
                      <div key={al.id} className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-md relative group hover:border-zinc-700 transition-all">
                        <span className="absolute top-4 right-4 text-[10px] font-bold text-red-400 font-mono bg-red-950/65 px-2.5 py-1 rounded-full border border-red-500/20">
                          {al.tipo}
                        </span>
                        <h5 className="font-extrabold text-md text-white pr-20 mb-2">{al.titulo}</h5>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">{al.descricao}</p>
                        <span className="text-[10px] text-zinc-500 font-mono block">
                          <Clock className="w-3 h-3 inline-block mr-1 align-text-top" />
                          {new Date(al.data_criacao).toLocaleDateString("pt-MZ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Suspect Numbers Blacklist Section */}
            {(() => {
              const realDenunciasWithSuspects = denuncias.filter(
                d => d.id !== "1" && d.id !== "2" && d.id !== "3" && d.numero_suspeito && d.numero_suspeito.trim().length >= 8
              );
              const blacklistedPhones = Array.from(
                new Set(realDenunciasWithSuspects.map(d => d.numero_suspeito?.trim()).filter(Boolean))
              );

              if (blacklistedPhones.length === 0) return null;

              return (
                <section className="py-8 bg-zinc-950 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="text-xs font-extrabold text-[#EF4444] font-mono tracking-widest uppercase flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                          CONTACTOS DE RISCO ATIVO
                        </span>
                        <h3 className="text-xl font-black text-white mt-1">Lista Negra: Suspeitos Reportados</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                          Números telefónicos com mais incidentes registados pela comunidade. Clique no número para verificar os registos públicos de burla.
                        </p>
                      </div>
                      <div className="bg-zinc-900 px-4 py-2.5 rounded-lg border border-zinc-800 flex items-center gap-3">
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                        <span className="text-sm font-bold text-zinc-300 font-mono">
                          {blacklistedPhones.length} {blacklistedPhones.length === 1 ? "Número na Lista Negra" : "Números na Lista Negra"}
                        </span>
                      </div>
                    </div>

                    {/* Grid of blacklisted badges */}
                    <div className="flex flex-wrap gap-3">
                      {blacklistedPhones.slice(0, 10).map((phone, idx) => {
                        const count = denuncias.filter(d => d.numero_suspeito?.trim() === phone).length;
                        const isReincidente = count >= 3;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveBlacklistPhone(phone);
                            }}
                            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-900 transition-all rounded-lg text-xs font-mono text-zinc-300 select-none cursor-pointer duration-150 active:scale-95 text-left animate-fade-in"
                          >
                            <Phone className="w-3.5 h-3.5 text-red-500" />
                            <span className="font-extrabold text-white">{phone}</span>
                            <span className={`${isReincidente ? "bg-red-955 text-red-400 border border-red-500/20 animate-pulse" : "bg-neutral-800 text-zinc-400"} text-[9px] font-sans font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider`}>
                              {count} {count === 1 ? 'denúncia' : 'denúncias'} {isReincidente ? '· REINCIDENTE' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Common Scams Portal Section 6 Cards Redesigned */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-800 bg-zinc-950">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-xs font-black text-red-650 font-mono tracking-widest uppercase">Canal de Prevenção</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">Tipos de Burlas mais Frequentes</h2>
                  <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
                    Selecione abaixo a categoria que mais se adequa ao seu caso para preencher a sua denúncia com privacidade absoluta.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Card 1: M-Pesa/E-Mola */}
                  <div 
                    onClick={() => selectCategoryFromCard("M-Pesa/E-Mola")}
                    className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md cursor-pointer hover:-translate-y-1 hover:border-red-500/30 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/20 text-red-500 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Phone className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="font-bold text-lg text-white mb-2 font-sans">M-Pesa, e-Mola ou mKesh</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      SMS fraudulentos alegando transações falsas e telefonemas imitando assistentes para obter códigos USSD e desviar fundos.
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-red-550 group-hover:text-white block mt-5 transition-colors">Iniciar Denúncia &rarr;</span>
                  </div>

                  {/* Card 2: Redes Sociais */}
                  <div 
                    onClick={() => selectCategoryFromCard("Redes Sociais")}
                    className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md cursor-pointer hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Layers className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="font-bold text-lg text-white mb-2 font-sans">Redes Sociais</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Perfis invadidos ou duplicados circulando mensagens de auxílio monetário urgente fingindo ser de amigos ou familiares.
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-blue-500 group-hover:text-white block mt-5 transition-colors">Iniciar Denúncia &rarr;</span>
                  </div>

                  {/* Card 3: Phishing */}
                  <div 
                    onClick={() => selectCategoryFromCard("Phishing")}
                    className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md cursor-pointer hover:-translate-y-1 hover:border-red-550/35 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/20 text-red-400 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Globe className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="font-bold text-lg text-white mb-2 font-sans">Phishing (Links Falsos)</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      SMS e e-mails copiando bancos moçambicanos (BCI, BIM, BIM Izi, Standard Bank) com websites falsos para furtar as suas chaves.
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-red-400 group-hover:text-white block mt-5 transition-colors">Iniciar Denúncia &rarr;</span>
                  </div>

                  {/* Card 4: Falso Investimento */}
                  <div 
                    onClick={() => selectCategoryFromCard("Falso Investimento")}
                    className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md cursor-pointer hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/20 text-amber-550 flex items-center justify-center mb-5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Wallet className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="font-bold text-lg text-white mb-2 font-sans">Falso Investimento / Pirâmides</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Propostas imperdíveis de investimento financeiro online com lucros irreais de retorno rápido que bloqueiam após os depósitos.
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-amber-500 group-hover:text-white block mt-5 transition-colors">Iniciar Denúncia &rarr;</span>
                  </div>

                  {/* Card 5: Comércio Online */}
                  <div 
                    onClick={() => selectCategoryFromCard("Comércio Online")}
                    className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md cursor-pointer hover:-translate-y-1 hover:border-red-600/30 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/20 text-red-450 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <FileText className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="font-bold text-lg text-white mb-2 font-sans">Comércio Falso (Sinal Inicial)</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Anúncios no WhatsApp, Facebook ou OLX de produtos muito baratos onde exigem sinal ou sinal de transporte e depois cortam o contacto.
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-red-400 group-hover:text-white block mt-5 transition-colors">Iniciar Denúncia &rarr;</span>
                  </div>

                  {/* Card 6: Outro */}
                  <div 
                    onClick={() => selectCategoryFromCard("Outro")}
                    className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md cursor-pointer hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700 text-zinc-400 flex items-center justify-center mb-5 group-hover:bg-zinc-650 group-hover:text-white transition-colors">
                      <HelpCircle className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="font-bold text-lg text-white mb-2 font-sans">Outros Tipos de Burlas</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Qualquer outro incidente de falsificação, extorsão, vazamento de conversa privada, e-mails falsificados ou esquemas suspeitos.
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400 group-hover:text-white block mt-5 transition-colors">Iniciar Denúncia &rarr;</span>
                  </div>

                </div>
              </div>
            </section>

            {/* How it Works Module Timeline */}
            <section className="bg-zinc-900/60 py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-xs font-black text-zinc-500 font-mono tracking-widest uppercase">Fácil e Acessível</span>
                  <h2 className="text-3xl font-black text-white mt-1">Como Funciona em 3 Passos</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-12 h-12 rounded-full bg-red-650 text-white flex items-center justify-center font-black text-lg mb-4 shadow font-mono">1</span>
                    <h5 className="font-bold text-lg text-white">Descreva o Caso</h5>
                    <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
                      Explique resumidamente o ocorrido. Introduza números de telemóvel dos golpistas, quantias perdidas e adicione capturas de ecrã SMS.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="w-12 h-12 rounded-full bg-red-650 text-white flex items-center justify-center font-black text-lg mb-4 shadow font-mono">2</span>
                    <h5 className="font-bold text-lg text-white">Guarde o Código</h5>
                    <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
                      Após submeter, o sistema criará o seu código especial confidencial de formato <span className="font-mono text-red-405">SDB-2026-XXXXX</span>. Guarde-o eletronicamente!
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="w-12 h-12 rounded-full bg-red-650 text-white flex items-center justify-center font-black text-lg mb-4 shadow font-mono">3</span>
                    <h5 className="font-bold text-lg text-white">Acompanhe do Seu Lado</h5>
                    <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
                      Introduza o código secreto na caixa de monitorização para saber as ações e auditorias conduzidas na base nacional das entidades reguladoras.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 2. VIEW: REPORT FORM ("FAZER DENÚNCIA") */}
        {/* ==================================================================== */}
        {page === "denunciar" && (
          <section className="py-12 bg-zinc-950 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <button 
                onClick={() => setPage("landing")}
                className="flex items-center gap-2 text-xs text-zinc-400 font-extrabold hover:text-white mb-6 uppercase inline-block cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao ecrã inicial</span>
              </button>

              <div className="text-center mb-8">
                <span className="p-3 bg-red-955/60 border border-red-500/30 rounded-full inline-block text-red-500 mb-3">
                  <Megaphone className="w-8 h-8 stroke-[2]" />
                </span>
                <h1 className="text-3xl font-black text-white font-sans tracking-tight">Efetuar Denúncia de Burlas</h1>
                <p className="text-zinc-400 text-sm mt-1">Preencha com o máximo de precisão. O formulário é totalmente anónimo e encriptado.</p>
              </div>

              {/* Stepper Wizard Indicator */}
              <div className="mb-8 font-sans">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-widest text-zinc-400 mb-3">
                  <span className={formStep === 1 ? "text-red-500 font-black" : ""}>1. CATEGORIA</span>
                  <span className={formStep === 2 ? "text-red-500 font-black" : ""}>2. DETALHES</span>
                  <span className={formStep === 3 ? "text-red-500 font-black" : ""}>3. EVIDÊNCIAS</span>
                  <span className={formStep === 4 ? "text-red-500 font-black" : ""}>4. REVISÃO</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-650 to-red-500 transition-all duration-300" 
                    style={{ width: `${(formStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8 shadow-xl">
                <form onSubmit={(e) => { e.preventDefault(); if (formStep === 4) handleReportSubmit(e); }}>
                  
                  {/* STEP 1: CATEGORIA */}
                  {formStep === 1 && (
                    <div className="animate-in fade-in duration-200">
                      <h3 className="text-lg font-bold text-white mb-4">Escolha a Categoria da Burla</h3>
                      <p className="text-xs text-zinc-400 mb-6 font-sans flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                        Selecione onde se enquadra o esquema fraudulento que sofreu ou identificou:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: "M-Pesa/E-Mola", label: "M-Pesa, E-Mola ou mKesh", desc: "SMS falsos, chamadas de supostos oficiais, ou pedidos de transferência USSD.", icon: Phone },
                          { key: "Redes Sociais", label: "Redes Sociais", desc: "WhatsApp pirateado, perfis duplicados no Facebook pedindo valores rápidos.", icon: Layers },
                          { key: "Phishing", label: "Phishing / Links Falsos", desc: "Websites copiados de bancos moçambicanos para roubar chaves e PIN.", icon: Globe },
                          { key: "Falso Investimento", label: "Investimento Fraudulento", desc: "Pirâmides online, esquemas de multiplicação rápida de dinheiro, aplicativos suspeitos.", icon: Wallet },
                          { key: "Comércio Online", label: "Comércio Falso de Bens", desc: "Páginas falsas de Facebook/WhatsApp exigindo depósitos de sinal antes da entrega.", icon: FileText },
                          { key: "Outro", label: "Outros Esquemas Digitais", desc: "Qualquer outro tipo de assédio, extorsão remota ou cibercrime financeiro.", icon: HelpCircle }
                        ].map((cat) => {
                          const IconComp = cat.icon;
                          const isSelected = formData.tipo_burla === cat.key;
                          return (
                            <button
                              key={cat.key}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, tipo_burla: cat.key });
                                setFormStep(2);
                              }}
                              className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 active:scale-98 ${
                                isSelected 
                                  ? "bg-red-950/40 border-red-500 text-white" 
                                  : "bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-350"
                              }`}
                            >
                              <div className="flex gap-3 items-start">
                                <div className={`p-2 rounded-lg ${isSelected ? "bg-red-650 text-white" : "bg-zinc-900 text-zinc-400"} flex-shrink-0`}>
                                  <IconComp className="w-5 h-5 stroke-[2]" />
                                </div>
                                <div className="text-left">
                                  <h4 className="font-bold text-sm text-white mb-1 font-sans">{cat.label}</h4>
                                  <p className="text-[11px] text-zinc-450 leading-normal font-sans">{cat.desc}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      
                      {formData.tipo_burla !== "" && (
                        <div className="mt-8 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setFormStep(2)}
                            className="bg-red-650 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <span>Continuar</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 2: DETALHES CARD */}
                  {formStep === 2 && (
                    <div className="animate-in fade-in duration-200 text-left">
                      <h3 className="text-lg font-bold text-white mb-5 font-sans">Detalhes do Incidente</h3>
                      
                      {/* Urgencia select buttons */}
                      <div className="mb-5 font-sans">
                        <label className="block text-sm font-bold text-zinc-200 mb-2">
                          Nível de Urgência <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { key: "Alta", desc: "Aconteceu agora / Renda roubada", color: "border-red-500/50 hover:border-red-500/95 text-red-400 bg-red-950/20" },
                            { key: "Média", desc: "Esquema recente", color: "border-amber-500/50 hover:border-amber-500/95 text-amber-400 bg-amber-950/20" },
                            { key: "Baixa", desc: "Tentativa falhada / Avulso", color: "border-zinc-700 hover:border-zinc-550 text-zinc-300 bg-zinc-950" }
                          ].map((urg) => {
                            const isSelected = formData.urgencia === urg.key;
                            return (
                              <button
                                key={urg.key}
                                type="button"
                                onClick={() => setFormData({ ...formData, urgencia: urg.key as any })}
                                className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all duration-150 ${
                                  isSelected 
                                    ? "ring-2 ring-red-500 text-white font-extrabold border-transparent" 
                                    : "opacity-85"
                                } ${urg.color}`}
                              >
                                <span className="text-xs font-black block font-sans">{urg.key}</span>
                                <span className="text-[9px] text-zinc-400 block mt-1 leading-tight font-sans">{urg.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Descricao area */}
                      <div className="mb-5 text-left">
                        <label htmlFor="descricao" className="block text-sm font-bold text-zinc-200 mb-2 font-sans text-left">
                          Descrição Detalhada do Incidente <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                          id="descricao" 
                          rows={4}
                          value={formData.descricao} 
                          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                          required
                          placeholder="Explique detalhadamente o esquema fraudulento. Mencione o que lhe disseram, que canais utilizaram e quais os pretextos apresentados pelo burlão..."
                          className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-zinc-900 placeholder-zinc-650 font-sans"
                        />
                        <div className="text-right text-[10px] text-zinc-500 mt-1 font-mono">
                          Mínimo 15 caracteres. Atual: {formData.descricao.length} caracteres.
                        </div>
                      </div>

                      {/* Suspeito number + value */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div className="text-left">
                          <label htmlFor="numero_suspeito" className="block text-sm font-bold text-zinc-200 mb-2 font-sans">
                            Telemóvel do Suspeito (Infrator)
                          </label>
                          <input 
                            type="text" 
                            id="numero_suspeito" 
                            value={formData.numero_suspeito} 
                            onChange={(e) => setFormData({ ...formData, numero_suspeito: e.target.value })}
                            placeholder="Ex: 84XXXXXXX ou 85XXXXXXX"
                            className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-zinc-900 placeholder-zinc-650"
                          />
                        </div>

                        <div className="text-left">
                          <label htmlFor="valor_envolvido" className="block text-sm font-bold text-zinc-200 mb-2 font-sans">
                            Prejuízo Financeiro (MZN)
                          </label>
                          <input 
                            type="number" 
                            id="valor_envolvido" 
                            value={formData.valor_envolvido} 
                            onChange={(e) => setFormData({ ...formData, valor_envolvido: e.target.value })}
                            placeholder="Deixe em branco ou zero se não houve perda"
                            className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-zinc-900 placeholder-zinc-650"
                          />
                        </div>
                      </div>

                      {/* Incident Date */}
                      <div className="mb-5 text-left">
                        <label htmlFor="data_incidente" className="block text-sm font-bold text-zinc-200 mb-2 font-sans text-left">
                          Data do Incidente <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="date" 
                          id="data_incidente" 
                          value={formData.data_incidente} 
                          onChange={(e) => setFormData({ ...formData, data_incidente: e.target.value })}
                          required
                          className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-zinc-900"
                        />
                      </div>

                      <div className="mt-8 flex justify-between gap-4 font-sans">
                        <button
                          type="button"
                          onClick={() => setFormStep(1)}
                          className="bg-transparent hover:bg-zinc-800 text-zinc-300 font-bold px-5 py-2.5 rounded-full text-xs border border-zinc-700 cursor-pointer"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.descricao.length < 15) {
                              showNotification("Por favor, descreva o incidente detalhadamente (no mínimo 15 caracteres).", "error");
                            } else {
                              setFormStep(3);
                            }
                          }}
                          className="bg-red-650 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                        >
                          <span>Continuar</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: EVIDÊNCIAS CARD */}
                  {formStep === 3 && (
                    <div className="animate-in fade-in duration-200 text-left">
                      <h3 className="text-lg font-bold text-white mb-4 font-sans">Adicionar Evidências Digitais</h3>
                      <p className="text-xs text-zinc-400 mb-6 font-sans">Submeta capturas de ecrã SMS, conversas do WhatsApp, faturas de depósitos ou documentos PDF de transações bancárias. Máximo de 5MB.</p>

                      {/* Drag & Drop Area */}
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                          isDragging ? "border-red-500 bg-red-955/20" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                        }`}
                      >
                        <input 
                          type="file" 
                          id="evidencias_upload" 
                          onChange={handleFileChange}
                          accept="image/*,application/pdf"
                          className="hidden" 
                        />
                        <label htmlFor="evidencias_upload" className="cursor-pointer block">
                          <Upload className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                          <span className="text-sm font-bold text-white block font-sans">Arraste os ficheiros aqui ou clique para selecionar</span>
                          <span className="text-[10px] text-zinc-500 block mt-1 font-mono">Formatos suportados: PNG, JPG, GIF, WebP, PDF (Máx. 5MB)</span>
                        </label>
                      </div>

                      {/* Uploaded File preview */}
                      {uploadedFile && (
                        <div className="mt-5 p-4 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between font-sans">
                          <div className="flex items-center gap-3 overflow-hidden text-left font-sans">
                            <div className="p-2 bg-zinc-900 rounded-lg text-red-500 border border-zinc-805 flex-shrink-0">
                              <FileText className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="overflow-hidden">
                              <span className="text-xs font-bold text-white block truncate">{uploadedFile.name}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{uploadedFile.size} · {uploadedFile.type}</span>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setUploadedFile(null)}
                            className="text-zinc-500 hover:text-red-555 transition-colors cursor-pointer text-xs font-bold px-2 py-1"
                          >
                            Remover
                          </button>
                        </div>
                      )}

                      <div className="mt-8 flex justify-between gap-4 font-sans">
                        <button
                          type="button"
                          onClick={() => setFormStep(2)}
                          className="bg-transparent hover:bg-zinc-800 text-zinc-350 font-bold px-5 py-2.5 rounded-full text-xs border border-zinc-700 cursor-pointer"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormStep(4)}
                          className="bg-red-650 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                        >
                          <span>Continuar</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: REVISÃO E ENVIO */}
                  {formStep === 4 && (
                    <div className="animate-in fade-in duration-200 font-sans">
                      <h3 className="text-lg font-bold text-white mb-5 text-left font-sans">Revisão Final da Denúncia</h3>

                      {/* Read-Only Summary */}
                      <div className="bg-zinc-950 rounded-xl border border-zinc-850 p-5 space-y-4 mb-6 text-xs sm:text-sm text-left">
                        <div className="grid grid-cols-2 gap-2 border-b border-zinc-900 pb-3">
                          <div>
                            <span className="text-[10px] text-zinc-500 block font-mono">TIPO DE CRIME</span>
                            <span className="font-bold text-white">{formData.tipo_burla || "Não selecionado"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 block font-mono font-mono">NÍVEL DE URGÊNCIA</span>
                            <span className="font-bold text-red-400">{formData.urgencia}</span>
                          </div>
                        </div>

                        <div className="border-b border-zinc-900 pb-3 text-left">
                          <span className="text-[10px] text-zinc-500 block font-mono uppercase">DESCRIÇÃO DO INCIDENTE</span>
                          <p className="text-zinc-350 leading-normal italic text-xs mt-1 bg-zinc-900 p-2.5 rounded border border-zinc-850 whitespace-pre-line font-sans">{formData.descricao}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-b border-zinc-900 pb-3 font-mono">
                          <div>
                            <span className="text-[10px] text-zinc-500 block font-mono">TELEFONE SUSPEITO</span>
                            <span className="font-bold text-white font-mono">{formData.numero_suspeito || "Não informado"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 block font-mono">VALOR ENVOLVIDO</span>
                            <span className="font-bold text-emerald-400 font-mono">{formData.valor_envolvido ? `${formatMZN(parseFloat(formData.valor_envolvido))}` : "Sem perda financeira"}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-zinc-500 block font-mono">DATA DE INCIDENTE</span>
                            <span className="font-bold text-white font-mono">{formData.data_incidente}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 block font-mono font-sans">ANEXO ADICIONADO</span>
                            <span className="font-bold text-zinc-350 truncate block">{uploadedFile ? uploadedFile.name : "Nenhum ficheiro fornecido"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Anonymity Default-on Toggle Section */}
                      <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 mb-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="text-left">
                            <label className="text-sm font-bold text-white block">Submeter de forma 100% Anónima</label>
                            <span className="text-xs text-zinc-500 block leading-tight mt-1">Se ativado, não registamos nem pedimos dados do seu e-mail para contacto regulatório.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, anonimo: !formData.anonimo })}
                            className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex-shrink-0 ${formData.anonimo ? "bg-red-650" : "bg-zinc-800"}`}
                          >
                            <div className={`w-5.5 h-5.5 rounded-full bg-white transition-transform ${formData.anonimo ? "translate-x-5.5" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {!formData.anonimo && (
                          <div className="text-left mt-4 border-t border-zinc-900 pt-4 animate-in slide-in-from-top-3 duration-200 font-sans">
                            <label htmlFor="telefone_denunciante_op" className="block text-xs font-bold text-zinc-350 mb-1.5 uppercase font-mono text-left font-sans">
                              Seu Telemóvel de Contacto (Opcional)
                            </label>
                            <input 
                              type="text" 
                              id="telefone_denunciante_op" 
                              value={formData.email_denunciante} 
                              onChange={(e) => setFormData({ ...formData, email_denunciante: e.target.value })}
                              placeholder="Ex: 84XXXXXXX ou 85XXXXXXX"
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
                            />
                            <span className="text-[10px] text-zinc-500 block leading-normal mt-1.5 text-left font-sans">O seu número será usado apenas para actualizações do estado da sua denúncia via SMS</span>
                          </div>
                        )}
                      </div>

                      {/* 4-Item Security Checklist */}
                      <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 mb-6 text-left">
                        <h4 className="font-extrabold text-sm text-red-500 mb-3 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                          CHECKLIST OBRIGATÓRIA DE SEGURANÇA
                        </h4>
                        <p className="text-xs text-zinc-400 mb-4 leading-normal font-sans">Por favor, assinale as caixas abaixo para certificar que procedeu com as ações preventivas imediatas:</p>
                        
                        <div className="space-y-3.5">
                          {[
                            { key: "chk_bloqueado", label: "Eu procedi ao bloqueio imediato do número suspeito no meu telemóvel." },
                            { key: "chk_avisado", label: "Alertei os meus familiares e conhecidos sobre este esquema recente." },
                            { key: "chk_contactado", label: "Se perdi fundos ou digitei PINs, já contactei o suporte de cliente da carteira/Banco." },
                            { key: "chk_veridicas", label: "Confirmo voluntariamente que as informações descritas acima são autênticas." }
                          ].map((chk) => {
                            const isChecked = (formData as any)[chk.key];
                            return (
                              <label key={chk.key} className="flex items-start gap-3 cursor-pointer select-none">
                                <span className="flex-shrink-0 mt-0.5">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => setFormData({ ...formData, [chk.key]: !isChecked })}
                                    className="hidden"
                                  />
                                  <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors ${isChecked ? "bg-red-500 border-red-550" : "border-zinc-700 bg-zinc-950"}`}>
                                    {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                                  </div>
                                </span>
                                <span className="text-xs text-zinc-300 leading-normal font-sans">{chk.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Submit Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => setFormStep(3)}
                          className="bg-transparent hover:bg-zinc-800 text-zinc-350 font-bold py-3.5 px-6 rounded-full text-xs border border-zinc-700 cursor-pointer font-sans"
                        >
                          Anterior
                        </button>
                        
                        <button 
                          type="submit"
                          disabled={!formData.chk_bloqueado || !formData.chk_avisado || !formData.chk_contactado || !formData.chk_veridicas}
                          className={`flex-1 font-extrabold py-3.5 px-6 rounded-full text-xs block flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all font-sans ${
                            (formData.chk_bloqueado && formData.chk_avisado && formData.chk_contactado && formData.chk_veridicas)
                              ? "bg-red-650 hover:bg-red-700 text-white cursor-pointer hover:scale-[1.01]" 
                              : "bg-zinc-800 text-zinc-550 cursor-not-allowed border border-[#111]"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4 stroke-[2]" />
                          <span>SUBMETER DENÚNCIA ANÓNIMA</span>
                        </button>
                      </div>
                    </div>
                  )}

                </form>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* 3. VIEW: CONFIRMATION SCREEN (CREATED SUCCESS) */}
        {/* ==================================================================== */}
        {page === "confirmacao" && (
          <section className="py-16 bg-[#0c0404]/40 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-in fade-in duration-350">
            <div className="absolute top-0 right-0 w-72 h-72 bg-red-950/10 blur-[80px] rounded-full translate-x-10 -translate-y-10" />
            
            <div className="max-w-2xl mx-auto text-center relative z-10 font-sans">
              
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-950/60 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-950/20 animate-bounce">
                  <CheckCircle className="w-12 h-12 stroke-[2.5]" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2 tracking-tight">Denúncia Registada com Sucesso!</h1>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto mb-8 font-sans">
                Agradecemos o seu contributo cívico contra cibercrimes em Moçambique. O seu caso foi encapsulado e guardado hermeticamente sob encriptação militar.
              </p>

              {/* Central Tracking Box in Dark Mode Accent */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8 shadow-xl mb-8">
                <span className="text-[10px] font-bold text-zinc-500 block tracking-widest uppercase mb-2 font-mono">Código Único de Rastreio Confidencial</span>
                <h2 className="text-2xl sm:text-3.5xl font-black text-red-500 select-all font-mono tracking-widest bg-zinc-950 border border-zinc-850 py-4 px-6 rounded-2xl max-w-md mx-auto shadow-inner">{newlyCreatedCode}</h2>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(newlyCreatedCode).then(() => {
                      showNotification("Código de rastreio copiado com sucesso!");
                    });
                  }}
                  className="mt-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-2 border border-zinc-805 transition-all cursor-pointer font-sans"
                >
                  <Check className="w-3.5 h-3.5 text-red-500" />
                  <span>Copiar Código</span>
                </button>
              </div>

              {/* Real Emergency Contacts Requested */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-7 text-left mb-8 shadow-xl">
                <h4 className="font-extrabold text-xs text-red-500 mb-4 uppercase tracking-wider font-mono flex items-center gap-1.5 font-sans">
                  <Phone className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>LINHAS DE EMERGÊNCIA REAIS (FALHOU? LIGUE JÁ)</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 hover:border-zinc-700 transition">
                    <span className="text-[9px] text-zinc-500 block font-mono font-bold uppercase tracking-wider">VODACOM MOÇAMBIQUE</span>
                    <strong className="text-base font-black text-white font-mono block mt-1">82 1234</strong>
                    <span className="text-[10px] text-zinc-400 block mt-1 font-sans">Linha para reportar fraudes diretas das carteiras digitais.</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 hover:border-zinc-700 transition">
                    <span className="text-[9px] text-zinc-500 block font-mono font-bold uppercase tracking-wider">PRM (POLÍCIA NACIONAL)</span>
                    <strong className="text-base font-black text-white font-mono block mt-1">119</strong>
                    <span className="text-[10px] text-zinc-400 block mt-1 font-sans">Contacto de emergência geral para denúncias de urgência.</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 hover:border-zinc-700 transition">
                    <span className="text-[9px] text-zinc-500 block font-mono font-bold uppercase tracking-wider">POLÍCIA ADICIONAL</span>
                    <strong className="text-base font-black text-white font-mono block mt-1">113</strong>
                    <span className="text-[10px] text-zinc-400 block mt-1 font-sans">Apoio operacional e de denúncias criminais urgentes.</span>
                  </div>
                </div>
              </div>

              {/* Security Warning Panel in Dark Theme */}
              <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/20 text-left text-zinc-300 max-w-2xl mx-auto mb-8 flex gap-3 text-xs shadow">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-1 text-white font-bold">Importante: Guarde ou tome captura deste ecrã.</strong>
                  <p className="text-zinc-400 leading-relaxed font-sans">
                    Nenhum login, credencial, ou base corporativa mapeia o seu nome pessoal por integridade civil. Se sair desta página sem registar o código, <strong>não será passível de ser recuperado no futuro</strong>.
                  </p>
                </div>
              </div>

              {/* Action Buttons Redefined */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <button 
                  onClick={() => {
                    setTrackingCodeQuery(newlyCreatedCode);
                    const match = denuncias.find(d => d.codigo_rastreio === newlyCreatedCode);
                    setFoundComplaint(match || null);
                    setHasSearched(true);
                    setAcompanharTab("code");
                    setPage("acompanhar");
                  }}
                  className="bg-red-650 hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-full text-xs sm:text-sm shadow-lg shadow-red-955/40 cursor-pointer flex items-center justify-center gap-2 font-sans"
                >
                  <Search className="w-4 h-4" />
                  <span>Acompanhar Agora</span>
                </button>
                <button 
                  onClick={() => setPage("landing")}
                  className="bg-transparent hover:bg-zinc-900 text-zinc-350 hover:text-white font-bold px-8 py-4 rounded-full text-xs sm:text-sm border border-zinc-700 cursor-pointer font-sans"
                >
                  Voltar ao Início
                </button>
              </div>

            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* 4. VIEW: TRACKING SCREEN ("ACOMPANHAR") */}
        {/* ==================================================================== */}
        {page === "acompanhar" && (
          <section className="py-16 bg-[#0c0404]/40 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[75vh] animate-in fade-in duration-300">
            <div className="absolute top-0 left-0 w-80 h-80 bg-red-950/10 blur-[90px] rounded-full -translate-x-12 -translate-y-12" />
            
            <div className="max-w-3xl mx-auto relative z-10 font-sans">
              
              {/* Back links */}
              <button 
                onClick={() => {
                  setPage("landing");
                  setHasSearched(false);
                }}
                className="flex items-center gap-2 text-xs text-zinc-400 font-bold hover:text-white mb-6 uppercase inline-block cursor-pointer transition"
              >
                <ArrowLeft className="w-4 h-4 text-red-500" />
                <span>Voltar ao ecrã inicial</span>
              </button>

              {/* Segmented Tab Switcher */}
              <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 mb-8 max-w-md mx-auto shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setAcompanharTab("code");
                    setHasSearched(false);
                  }}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    acompanharTab === "code" 
                      ? "bg-red-650 text-white shadow-md shadow-red-950/40" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50"
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Rastrear Denúncia</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAcompanharTab("phone");
                    setHasSearched(false);
                  }}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    acompanharTab === "phone" 
                      ? "bg-red-650 text-white shadow-md shadow-red-950/40" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Verificar Número</span>
                </button>
              </div>

              {/* Inquiry Card Block */}
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8 shadow-2xl mb-8 max-w-2xl mx-auto text-center">
                
                {acompanharTab === "code" ? (
                  <>
                    <div className="mb-6">
                      <span className="p-3.5 bg-zinc-950 rounded-2xl inline-flex text-red-500 border border-zinc-850 shadow-inner">
                        <Search className="w-7 h-7" />
                      </span>
                    </div>
                    
                    <h1 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Rastrear Código de Denúncia</h1>
                    <p className="text-zinc-400 text-xs max-w-md mx-auto mb-6 leading-relaxed">
                      Insira o seu código providenciado no formato <code className="text-red-400 font-mono font-bold">SDB-2026-XXXXX</code> para verificar a timeline do processo e despacho administrativo.
                    </p>

                    <form onSubmit={handleSearchTracking} className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Key className="absolute top-3.5 left-4 w-4 h-4 text-zinc-500" />
                        <input 
                          type="text" 
                          value={trackingCodeQuery}
                          onChange={(e) => setTrackingCodeQuery(e.target.value)}
                          required
                          placeholder="SDB-2026-J92FA"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-xs sm:text-sm font-mono tracking-wider placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-zinc-950 focus:border-transparent uppercase"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-red-650 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-red-950/30 cursor-pointer transition-all duration-200 active:scale-[0.98] font-sans flex items-center justify-center gap-2 shrink-0"
                      >
                        <Search className="w-4 h-4 animate-spin-once" />
                        <span>Rastrear Código</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <span className="p-3.5 bg-zinc-950 rounded-2xl inline-flex text-red-500 border border-zinc-850 shadow-inner">
                        <Phone className="w-7 h-7" />
                      </span>
                    </div>
                    
                    <h1 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Verificar Número Suspeito</h1>
                    <p className="text-zinc-400 text-xs max-w-md mx-auto mb-6 leading-relaxed">
                      Insira um número suspeito (Vodacom, mcel, Movitel) para auditarmos de forma confidencial as denúncias acumuladas contra ele na comunidade.
                    </p>

                    <form onSubmit={handleSearchPhone} className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Phone className="absolute top-3.5 left-4 w-4 h-4 text-zinc-500" />
                        <input 
                          type="text" 
                          value={searchPhoneQuery}
                          onChange={(e) => setSearchPhoneQuery(e.target.value)}
                          required
                          placeholder="ex: 84XXXXXXX ou 82XXXXXXX"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-xs sm:text-sm font-mono tracking-wider placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-zinc-950 focus:border-transparent"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-red-650 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-red-950/30 cursor-pointer transition-all duration-200 active:scale-[0.98] font-sans flex items-center justify-center gap-2 shrink-0"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Verificar Risco</span>
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* SEARCH RESULTS OUTPUT */}
              
              {/* A: Code Search Output */}
              {acompanharTab === "code" && hasSearched && (
                foundComplaint ? (
                  <div className="bg-zinc-900 rounded-3xl border-l-[6px] border-red-600 border-y border-r border-zinc-800 p-6 sm:p-8 shadow-2xl transition-all animate-fade-in text-left">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-4 mb-5 gap-3">
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider">CÓDIGO CASO ENCRIPTADO</span>
                        <h4 className="text-lg sm:text-xl font-bold font-mono text-white uppercase tracking-widest">{foundComplaint.codigo_rastreio}</h4>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono block mb-1 uppercase tracking-wider">ESTADO DO PROCESSO</span>
                        <span className={`inline-block py-1 px-3.5 rounded-full text-[10px] font-bold ${
                          foundComplaint.estado === "Em Análise" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                          foundComplaint.estado === "Confirmada" ? "bg-red-500/10 text-red-405 border border-red-500/20" :
                          foundComplaint.estado === "Em Investigação" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          foundComplaint.estado === "Resolvida" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}>
                          {foundComplaint.estado}
                        </span>
                      </div>
                    </div>

                    {/* Consolidated stats info block */}
                    <h5 className="font-extrabold text-xs text-red-500 mb-3 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Layers className="w-4 h-4" />
                      <span>Propriedades Registadas em Base de Dados</span>
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950 border border-zinc-850 p-4 rounded-2xl mb-6 font-sans">
                      <div>
                        <span className="text-[10px] text-zinc-500 block font-mono">CATEGORIA</span>
                        <strong className="text-xs sm:text-sm text-zinc-200">{foundComplaint.tipo_burla}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block font-mono">NÚMERO DO SUSPEITO</span>
                        <strong className="text-xs sm:text-sm text-red-400 font-mono tracking-wider">{foundComplaint.numero_suspeito || "Não providenciado"}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block font-mono">DATA DE SUBMISSÃO</span>
                        <strong className="text-xs sm:text-sm text-zinc-300 font-mono">{new Date(foundComplaint.data_criacao).toLocaleDateString("pt-MZ")}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block font-mono">PREJUÍZO ASSOCIADO</span>
                        <strong className="text-xs sm:text-sm text-emerald-400 font-mono">{formatMZN(foundComplaint.valor_envolvido)}</strong>
                      </div>
                    </div>

                    {/* Interactive timelines */}
                    <h5 className="font-extrabold text-xs text-red-500 mb-5 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                      <span>Timeline e Resolução Física</span>
                    </h5>

                    <div className="space-y-6 relative pl-5 border-l border-zinc-800">
                      
                      {/* Step 1: Registada */}
                      <div className="relative">
                        <div className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full bg-red-600 ring-4 ring-red-950/60" />
                        <div>
                          <strong className="text-xs text-white block leading-none mb-1 font-sans">Denúncia Registada e Anonimizada</strong>
                          <span className="text-[10px] text-zinc-500 block mb-1.5 font-mono">{new Date(foundComplaint.data_criacao).toLocaleDateString("pt-MZ")}</span>
                          <p className="text-xs text-zinc-400 leading-normal font-sans">
                            Submissão aceite e indexada em PostgreSQL do Supabase. Todos os metadados pessoais foram redefinidos para anonimato absoluto.
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Análise */}
                      <div className="relative">
                        <div className={`absolute -left-[25px] top-0.5 w-3 h-3 rounded-full ${
                          foundComplaint.estado !== "Em Análise" ? "bg-red-600 ring-4 ring-red-950/60" : "bg-zinc-800 ring-4 ring-zinc-900"
                        }`} />
                        <div>
                          <strong className="text-xs text-white block leading-none mb-1 font-sans">Avaliação e Triagem de Evidências</strong>
                          <span className="text-[10px] text-zinc-500 block mb-1.5 font-mono">{new Date(foundComplaint.data_atualizacao).toLocaleDateString("pt-MZ")}</span>
                          <p className="text-xs text-zinc-400 leading-normal font-sans">
                            {foundComplaint.estado === "Rejeitada" ? (
                              <span className="text-red-400 font-bold">Processo rejeitado. Os detalhes declarados ou evidências anexadas revelaram incongruências graves.</span>
                            ) : foundComplaint.estado !== "Em Análise" ? (
                              <span>Validação técnica bem-sucedida. Caso indexado nos alarmes comunitários e pronto para cruzamento tático.</span>
                            ) : (
                              <span className="text-zinc-500 italic">Pendente na fila de processamento de administradores SDB-MZ.</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Conclusão */}
                      <div className="relative">
                        <div className={`absolute -left-[25px] top-0.5 w-3 h-3 rounded-full ${
                          foundComplaint.estado === "Resolvida" ? "bg-red-600 ring-4 ring-red-950/60" : "bg-zinc-805 ring-4 ring-zinc-900"
                        }`} />
                        <div>
                          <strong className="text-xs text-white block leading-none mb-1 font-sans">Oficialização Governamental / Resolução</strong>
                          <p className="text-xs text-zinc-400 leading-normal font-sans">
                            {foundComplaint.estado === "Resolvida" ? (
                              <span className="text-emerald-400 font-bold">Burla Resolvida! Número infrator bloqueado e partilhado no painel público para proteção comunitária Moçambicana.</span>
                            ) : (
                              <span className="text-zinc-500">Uma vez confirmado, o contacto do burlão é processado para alertas no M-Pesa/carteiras das operadoras e arquivado de forma definitiva.</span>
                            )}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Self-Resolve Button */}
                    {foundComplaint.estado !== "Resolvida" && (
                      <div className="mt-8 pt-6 border-t border-zinc-800 text-center animate-in fade-in zoom-in-95 duration-200">
                        <p className="text-zinc-405 text-xs mb-4 leading-relaxed font-sans max-w-md mx-auto">
                          Se o seu caso foi resolvido, o valor devolvido ou o golpista bloqueado, marque esta denúncia como resolvida para actualizar as estatísticas públicas.
                        </p>
                        <button
                          onClick={() => handleResolveComplaint(foundComplaint.id)}
                          className="px-6 py-3.5 bg-emerald-650 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/40 cursor-pointer transition-all duration-200 active:scale-[0.98] font-sans inline-flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                          <span>Marcar como Resolvida</span>
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-zinc-900 rounded-3xl border border-red-900/30 p-6 sm:p-8 shadow-2xl transition-all animate-fade-in text-center max-w-2xl mx-auto">
                    <span className="p-3 bg-red-950/60 text-red-500 rounded-2xl inline-block border border-red-800/20 mb-3">
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </span>
                    <h4 className="text-md font-bold text-white mb-1">Código de Rastreio Inválido</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-md mx-auto">
                      Não foi localizada nenhuma denúncia correspondente a <code className="text-red-400 font-mono font-bold uppercase">{trackingCodeQuery}</code>. Por favor, ratifique de forma atenta o formato e tente novamente.
                    </p>
                  </div>
                )
              )}

              {/* B: Phone Number Verification Search Output */}
              {acompanharTab === "phone" && hasSearched && (() => {
                const trimmedQuery = searchPhoneQuery.trim().replace(/[\s\-\+\(\)]/g, "");
                const matchingDenuncias = denuncias.filter(d => {
                  const suspectClean = d.numero_suspeito?.trim().replace(/[\s\-\+\(\)]/g, "") || "";
                  return suspectClean !== "" && (suspectClean.endsWith(trimmedQuery) || trimmedQuery.endsWith(suspectClean));
                });

                if (matchingDenuncias.length === 0) {
                  return (
                    <div className="bg-zinc-900 rounded-3xl border border-emerald-900/30 p-6 sm:p-8 shadow-2xl transition-all animate-fade-in text-center max-w-2xl mx-auto border-l-[6px] border-l-emerald-600 font-sans">
                      <span className="p-3.5 bg-emerald-950/60 text-emerald-400 rounded-2xl inline-block border border-emerald-800/20 mb-3.5">
                        <Shield className="w-7 h-7" />
                      </span>
                      <h4 className="text-md sm:text-lg font-bold text-white mb-2 uppercase tracking-wide">Sem Registos Ativos de Burla</h4>
                      <p className="text-xs text-zinc-350 leading-relaxed max-w-md mx-auto mb-3">
                        O contacto <strong className="text-white font-mono">{searchPhoneQuery}</strong> não possui queixas registadas no ecossistema SDB-MZ até ao momento.
                      </p>
                      <p className="text-[10px] text-zinc-500 leading-relaxed max-w-md mx-auto border-t border-zinc-850 pt-3">
                        Atenção: A ausência de queixas não assegura fidedignidade. Use bom senso, não envie adiantamentos M-Pesa por bens não vistos e proteja o seu PIN.
                      </p>
                    </div>
                  );
                }

                const isHighRisk = matchingDenuncias.length >= 3;
                const totalReports = matchingDenuncias.length;

                // Calculate most frequent type
                const counts: Record<string, number> = {};
                matchingDenuncias.forEach(d => {
                  counts[d.tipo_burla] = (counts[d.tipo_burla] || 0) + 1;
                });
                let mostFrequentType = "Não identificado";
                let maxCount = 0;
                Object.entries(counts).forEach(([type, count]) => {
                  if (count > maxCount) {
                    maxCount = count;
                    mostFrequentType = type;
                  }
                });

                return (
                  <div className="bg-zinc-900 rounded-3xl border-y border-r border-zinc-800 p-6 sm:p-8 shadow-2xl transition-all animate-fade-in text-left max-w-2xl mx-auto border-l-[6px] border-l-red-650 font-sans">
                    
                    <div className="flex items-center gap-3.5 border-b border-zinc-855 pb-4 mb-5">
                      <span className={`p-3 rounded-xl inline-block border ${
                        isHighRisk 
                          ? "bg-red-955 text-red-500 border-red-500/20 animate-pulse" 
                          : "bg-amber-950/40 text-amber-500 border-amber-500/20"
                      }`}>
                        <AlertTriangle className="w-6 h-6" />
                      </span>
                      <div>
                        <span className={`text-[9px] font-mono block font-bold uppercase tracking-widest ${isHighRisk ? "text-red-500 animate-pulse" : "text-amber-500"}`}>
                          {isHighRisk ? "ALERTA CRÍTICO: REINCIDENTE" : "ALERTA: CONTACTO SINALIZADO"}
                        </span>
                        <h4 className="text-base font-black text-white uppercase font-sans">Resultado da Auditoria Preventiva</h4>
                      </div>
                    </div>

                    {/* Highly highlighted phone card with quick stats */}
                    <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 mb-5 text-center">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono block mb-1">AUDITORIA DE TELEFONE</span>
                      <h2 className="text-xl sm:text-2.5xl font-mono text-red-500 font-extrabold tracking-wider block mb-4 select-all">{searchPhoneQuery}</h2>
                      
                      <div className="grid grid-cols-2 gap-3.5 text-left">
                        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                          <span className="text-[9px] text-zinc-500 block uppercase font-mono mb-0.5">Total de Queixas</span>
                          <strong className="text-sm font-black text-white font-mono">{totalReports}</strong>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                          <span className="text-[9px] text-zinc-500 block uppercase font-mono mb-0.5">Burla Mais Recorrente</span>
                          <strong className="text-xs font-bold text-zinc-300 truncate block mt-0.5">{mostFrequentType}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Community warning banner */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-200 font-semibold leading-relaxed">
                        ⚠️ Este número foi reportado {totalReports} vez(es) pela comunidade.
                      </p>
                    </div>

                    {/* Historical List of Incidents for transparency */}
                    <h5 className="font-extrabold text-xs text-red-500 mb-4 uppercase tracking-wider font-mono">Histórico Parcial das Reclamações</h5>
                    <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {matchingDenuncias.map((rec) => (
                        <div key={rec.id} className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
                          <div className="flex justify-between items-start gap-3 border-b border-zinc-900 pb-2 mb-2">
                            <div>
                              <span className="text-[9px] text-zinc-500 font-mono block">SERVIÇO AFECTADO</span>
                              <strong className="text-xs text-white uppercase">{rec.tipo_burla}</strong>
                            </div>
                            <span className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-805 px-2 py-0.5 rounded-full font-mono font-medium">
                              {new Date(rec.data_incidente).toLocaleDateString("pt-MZ")}
                            </span>
                          </div>
                          
                          <p className="text-xs text-zinc-400 leading-normal font-sans">
                            &ldquo;{rec.descricao.length > 150 ? rec.descricao.substring(0, 150) + "..." : rec.descricao}&rdquo;
                          </p>
                          
                          <div className="flex justify-between items-center mt-3 text-[10px]">
                            <span className="text-zinc-505 font-sans">
                              Urgência: <span className={`font-bold ${
                                rec.nivel_urgencia === "Alta" ? "text-red-400" : "text-amber-400"
                              }`}>{rec.nivel_urgencia}</span>
                            </span>
                            <span className="text-zinc-505 font-sans font-medium">Estado: <span className="text-red-500 font-bold font-mono">{rec.estado}</span></span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })()}

            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* 5. VIEW: ESTATÍSTICAS E TRANSPARÊNCIA PÚBLICA */}
        {/* ==================================================================== */}
        {page === "estatisticas" && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-300 font-sans">
            {/* Header with Title and CSV EXPORT */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-805 pb-8 mb-8">
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-zinc-900 text-red-500 border border-zinc-700/50 rounded-full uppercase tracking-widest mb-3 font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Transparência Pública e Monitoria BD
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">Estatísticas de Cibercrime SDB-MZ</h1>
                <p className="text-zinc-405 text-sm sm:text-base mt-2 max-w-2xl">
                  Auditoria em tempo real de tentativas de burlas relatadas voluntariamente pela comunidade em Moçambique.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={triggerSimulationCSVExport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-950/60 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold hover:bg-red-900/30 transition shadow-lg cursor-pointer max-md:w-full justify-center"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Exportar Registos (CSV)</span>
                </button>
                <button
                  onClick={() => setPage("landing")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-850 cursor-pointer max-md:hidden"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
              </div>
            </div>

            {/* Core Statistics grid of 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[35px] rounded-full" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-mono">Total de Denúncias</span>
                <strong className="text-3xl sm:text-4xl font-black text-white font-mono block mt-2">{denuncias.length}</strong>
                <p className="text-[11px] text-zinc-500 mt-2 font-sans">Indexados no repositório de inteligência criminal digital.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[35px] rounded-full" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-mono">Casos Resolvidos</span>
                <strong className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono block mt-2">
                  {denuncias.filter(d => d.estado === "Resolvida").length}
                </strong>
                <p className="text-[11px] text-zinc-500 mt-2 font-sans">Casos marcados como solucionados pelos próprios cidadãos.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[35px] rounded-full" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-mono">Burlas Prejuízo Acumulado</span>
                <strong className="text-2xl sm:text-3xl font-black text-red-400 font-mono block mt-2.5">
                  {formatMZN(totalValueLost)}
                </strong>
                <p className="text-[11px] text-zinc-500 mt-2 font-sans">Impacto financeiro empírico acumulado reportado em MZN.</p>
              </div>
            </div>

            {/* Middle Grid: Type stats & Alerts & Suspicious numbers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              
              {/* Left col (4 cols): Scam types & Suspicious numbers */}
              <div className="lg:col-span-4 space-y-6 text-left">
                
                {/* 1. Types of scams breakdown block */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                  <h4 className="font-extrabold text-xs text-red-500 tracking-wider font-mono uppercase mb-4 flex items-center gap-1.5 font-sans">
                    <Layers className="w-4 h-4 text-red-500" />
                    Frequência por Tipo de Burla
                  </h4>
                  <div className="space-y-4 font-sans text-xs">
                    {Object.entries(typeCounts).map(([type, count]) => {
                      const total = denuncias.length || 1;
                      const pct = Math.round(((count as number) / total) * 100);
                      return (
                        <div key={type}>
                          <div className="flex justify-between items-center text-zinc-350 mb-1 font-sans">
                            <span className="font-bold">{type}</span>
                            <span className="font-mono text-zinc-500">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Public Alerts sidebar */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                  <h4 className="font-extrabold text-xs text-red-500 tracking-wider font-mono uppercase mb-4 flex items-center gap-1.5 font-sans">
                    <Radio className="w-4 h-4 text-red-500" />
                    Alertas Comunitários Ativos
                  </h4>
                  {alertas.filter(a => a.ativo).length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">Nenhum alerta governamental activo neste momento.</p>
                  ) : (
                    <div className="space-y-3 font-sans">
                      {alertas.filter(a => a.ativo).slice(0, 4).map(al => (
                        <div key={al.id} className="p-3 bg-zinc-955 border border-zinc-850 rounded-xl">
                          <h5 className="font-bold text-xs text-white mb-1 font-sans">{al.titulo}</h5>
                          <p className="text-[10px] text-zinc-400 leading-normal mb-1">{al.descricao}</p>
                          <span className="text-[9px] text-zinc-500 font-mono">Tipo: {al.tipo}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Blacklist top suspicious phone ranking numbers */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                  <h4 className="font-extrabold text-xs text-red-500 tracking-wider font-mono uppercase mb-4 flex items-center gap-1.5 font-sans">
                    <Phone className="w-4 h-4 text-red-500" />
                    Números mais Reportados
                  </h4>
                  {phoneRanking.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">Nenhum contacto pendente na lista de risco.</p>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {phoneRanking.slice(0, 6).map((pr, pIdx) => (
                        <div 
                          key={pIdx} 
                          onClick={() => {
                            setActiveBlacklistPhone(pr.number);
                          }}
                          className="p-2.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-850 rounded-xl flex items-center justify-between cursor-pointer transition border-l-2 border-l-red-500"
                        >
                          <span className="font-mono text-xs font-bold text-red-450">{pr.number}</span>
                          <span className="bg-red-955/40 text-red-405 border border-red-500/10 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase font-sans">
                            {pr.oco} {pr.oco === 1 ? "queixa" : "queixas"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
              
              {/* Right/Central Col (8 cols): Searchable/Filterable Public Complaints Registry Table */}
              <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg text-left">
                <h4 className="font-extrabold text-sm text-white uppercase tracking-wider mb-2 flex items-center gap-2 font-sans">
                  <Layers className="w-4.5 h-4.5 text-red-500" />
                  <span>Registo Público de Ocorrências Digitais ({filteredReportsList.length})</span>
                </h4>
                <p className="text-xs text-zinc-405 mb-6 font-sans">
                  Registo audital público de metadados de queixas enviadas pelos cidadãos. Utilize os filtros abaixo para cruzar ameaças.
                </p>

                {/* Search & filters Inputs layout inside public registry */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-4 bg-zinc-950 border border-zinc-855 rounded-2xl">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase font-mono mb-1.5">Tipo de Burla</label>
                    <select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 text-white rounded-xl text-xs p-2.5 w-full focus:ring-1 focus:ring-red-500 focus:outline-none cursor-pointer font-sans"
                    >
                      <option value="">Todos...</option>
                      <option value="M-Pesa/E-Mola">M-Pesa/E-Mola</option>
                      <option value="Redes Sociais">Redes Sociais</option>
                      <option value="Phishing">Phishing</option>
                      <option value="Falso Investimento">Falso Investimento</option>
                      <option value="Comércio Online">Comércio Online</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase font-mono mb-1.5">Estado</label>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 text-white rounded-xl text-xs p-2.5 w-full focus:ring-1 focus:ring-red-500 focus:outline-none cursor-pointer font-sans"
                    >
                      <option value="">Todos...</option>
                      <option value="Em Análise">Em Análise</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Em Investigação">Em Investigação</option>
                      <option value="Resolvida">Resolvida</option>
                      <option value="Rejeitada">Rejeitada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase font-mono mb-1.5">Palavra-Chave</label>
                    <input 
                      type="text" 
                      value={searchFilterKeyword}
                      onChange={(e) => setSearchFilterKeyword(e.target.value)}
                      placeholder="Código, nº suspeito..."
                      className="bg-zinc-900 border border-zinc-800 text-white rounded-xl text-xs p-2.5 w-full focus:ring-1 focus:ring-red-500 focus:outline-none placeholder-zinc-600 font-sans"
                    />
                  </div>
                </div>

                {/* Registry Complaints Table Render */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                  <table className="w-full text-left text-xs text-zinc-300 border-collapse">
                    <thead className="bg-zinc-950 text-zinc-450 font-bold uppercase text-[9px] border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-3">Código</th>
                        <th className="py-3 px-2">Data Caso</th>
                        <th className="py-3 px-2">Tipo</th>
                        <th className="py-3 px-2">Nº Suspeito</th>
                        <th className="py-3 px-2 text-right">Valor</th>
                        <th className="py-3 px-2 text-center">Estado</th>
                        <th className="py-3 px-3 text-center">Ficha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-855">
                      {filteredReportsList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-zinc-550 italic font-sans animate-fade-in">
                            Nenhum registo localizado sob este termo de busca.
                          </td>
                        </tr>
                      ) : (
                        filteredReportsList.map(item => (
                          <tr key={item.id} className="hover:bg-zinc-955/45 transition">
                            <td className="py-3 px-3 font-mono font-bold text-red-500 uppercase select-all">{item.codigo_rastreio}</td>
                            <td className="py-3 px-2 font-mono text-zinc-450">{new Date(item.data_incidente).toLocaleDateString("pt-MZ")}</td>
                            <td className="py-3 px-2 font-bold text-white font-sans">{item.tipo_burla}</td>
                            <td className="py-3 px-2 font-mono text-red-400 font-semibold select-all">{item.numero_suspeito || "-"}</td>
                            <td className="py-3 px-2 font-mono text-right text-emerald-455 font-bold">{formatMZN(item.valor_envolvido)}</td>
                            <td className="py-3 px-2 text-center">
                              <span className={`inline-block py-0.5 px-2 rounded-full font-bold text-[9px] ${
                                item.estado === "Em Análise" ? "bg-amber-500/10 text-amber-550" :
                                item.estado === "Confirmada" ? "bg-red-500/10 text-red-405" :
                                item.estado === "Em Investigação" ? "bg-blue-500/10 text-blue-405" :
                                item.estado === "Resolvida" ? "bg-emerald-500/10 text-emerald-400 font-sans" :
                                "bg-zinc-800 text-zinc-400"
                              }`}>
                                {item.estado}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button 
                                onClick={() => {
                                  setSelectedReport(item);
                                }}
                                className="p-1.5 bg-zinc-950 hover:bg-red-650 hover:text-white rounded-lg text-red-500 border border-red-500/15 cursor-pointer flex items-center justify-center mx-auto transition duration-150 active:scale-95"
                                title="Ver Ficha Completa"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* 6. VIEW: ADMIN CONTROL PANEL DASHBOARD */}
        {/* ==================================================================== */}
        {page === "admin_dashboard" && (
          <section className="py-8 bg-slate-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Head line */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">AMBIEÇÃO REVOLUCIONÁRIA</span>
                  <h1 className="text-2xl font-black text-slate-900 uppercase">Dashboard de Administração SDB-MZ</h1>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={triggerSimulationCSVExport}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-2 border border-slate-700/50 shadow"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-amber-500" />
                    <span>Exportar CSV</span>
                  </button>
                  <button 
                    onClick={() => {
                      setAdminLoggedIn(false);
                      setPage("landing");
                      showNotification("Terminou a sessão administrativa.");
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>

              {/* Grid Cards Stats indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-250 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">TOTAL DENÚNCIAS</span>
                    <strong className="text-2xl font-black text-slate-900 font-mono">{totalReportsCount}</strong>
                  </div>
                  <span className="p-3 bg-blue-50 text-blue-600 rounded-full"><FileText className="w-6 h-6" /></span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-250 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">FILA (EM TRIAGEM)</span>
                    <strong className="text-2xl font-black text-slate-900 font-mono text-amber-600">{underAnalysisCount}</strong>
                  </div>
                  <span className="p-3 bg-amber-50 text-amber-600 rounded-full"><Clock className="w-6 h-6 animate-pulse" /></span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-250 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">RESOLVIDAS / ARQUIVADAS</span>
                    <strong className="text-2xl font-black text-slate-900 font-mono text-green-600">{resolvedCount}</strong>
                  </div>
                  <span className="p-3 bg-green-50 text-green-600 rounded-full"><CheckCircle className="w-6 h-6" /></span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-250 shadow-sm flex justify-between items-center text-ellipsis overflow-hidden">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 font-mono block">BURLAS PREJUÍZO ACUMULADO</span>
                    <strong className="text-lg font-black text-slate-950 font-mono truncate block" title={formatMZN(totalValueLost)}>{formatMZN(totalValueLost)}</strong>
                  </div>
                  <span className="p-3 bg-red-50 text-red-600 rounded-full flex-shrink-0"><Wallet className="w-6 h-6" /></span>
                </div>
              </div>

              {/* Layout structure split: Sidebar Subtab vs View Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. Left Navigation Tab controller (Col 3) */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
                    <h5 className="font-extrabold text-[#111] text-xs uppercase tracking-wider px-3 mb-2 font-mono">Painel Administrativo</h5>

                    <button 
                      onClick={() => setAdminSubTab("denuncias")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 ${
                        adminSubTab === "denuncias" ? "bg-[#009a44] text-white" : "bg-transparent text-slate-705 hover:bg-slate-50"
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>Fila de Denúncias</span>
                    </button>

                    <button 
                      onClick={() => setAdminSubTab("alertas")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 ${
                        adminSubTab === "alertas" ? "bg-[#009a44] text-white" : "bg-transparent text-slate-705 hover:bg-slate-50"
                      }`}
                    >
                      <Radio className="w-4 h-4" />
                      <span>Gerir Alertas</span>
                    </button>

                    <button 
                      onClick={() => setAdminSubTab("numeros")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 ${
                        adminSubTab === "numeros" ? "bg-[#009a44] text-white" : "bg-transparent text-slate-750 hover:bg-slate-50"
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      <span>Números Reportados ({phoneRanking.length})</span>
                    </button>
                  </div>
                </div>

                {/* 2. Right Data render list (Col 9) */}
                <div className="lg:col-span-9">
                  
                  {/* TAB 1: DENUNCIAS LOG LIST */}
                  {adminSubTab === "denuncias" && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <h4 className="font-extrabold text-sm text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#009a44]" />
                        <span>Gestão e Triagem da Fila de Denúncias</span>
                      </h4>

                      {/* Filter inputs Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-4 bg-slate-50 rounded-xl border">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Tipo de Burla</label>
                          <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white border rounded-lg text-xs p-2 leading-none w-full"
                          >
                            <option value="">Todos...</option>
                            <option value="M-Pesa/E-Mola">M-Pesa/E-Mola</option>
                            <option value="Redes Sociais">Redes Sociais</option>
                            <option value="Phishing">Phishing</option>
                            <option value="Falso Investimento">Falso Investimento</option>
                            <option value="Comércio Online">Comércio Online</option>
                            <option value="Outro">Outro</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Estado</label>
                          <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white border rounded-lg text-xs p-2 leading-none w-full"
                          >
                            <option value="">Todos...</option>
                            <option value="Em Análise">Em Análise</option>
                            <option value="Confirmada">Confirmada</option>
                            <option value="Em Investigação">Em Investigação</option>
                            <option value="Resolvida">Resolvida</option>
                            <option value="Rejeitada">Rejeitada</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Palavra-Chave</label>
                          <input 
                            type="text" 
                            value={searchFilterKeyword}
                            onChange={(e) => setSearchFilterKeyword(e.target.value)}
                            placeholder="Pesquisa por código, número..."
                            className="bg-white border rounded-lg text-xs p-2 leading-none w-full"
                          />
                        </div>
                      </div>

                      {/* Complaints Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-650 border border-slate-200">
                          <thead className="bg-slate-900 text-white font-bold uppercase text-[9px]">
                            <tr>
                              <th className="py-3 px-3">Código</th>
                              <th className="py-3 px-2">Data Caso</th>
                              <th className="py-3 px-2">Tipo</th>
                              <th className="py-3 px-2">Nº Suspeito</th>
                              <th className="py-3 px-2 text-right">Valor</th>
                              <th className="py-3 px-2 text-center">Estado</th>
                              <th className="py-3 px-3 text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredReportsList.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="text-center py-8 text-slate-400">
                                  Nenhum registo localizado nesta sub-pesquisa.
                                </td>
                              </tr>
                            ) : (
                              filteredReportsList.map(item => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                                  <td className="py-3 px-3 font-mono font-bold text-slate-900 uppercase">{item.codigo_rastreio}</td>
                                  <td className="py-3 px-2">{new Date(item.data_incidente).toLocaleDateString("pt-MZ")}</td>
                                  <td className="py-3 px-2 font-bold">{item.tipo_burla}</td>
                                  <td className="py-3 px-2 font-mono text-red-650 font-semibold">{item.numero_suspeito || "-"}</td>
                                  <td className="py-3 px-2 font-mono text-right text-green-700 font-bold">{formatMZN(item.valor_envolvido)}</td>
                                  <td className="py-3 px-2 text-center">
                                    <span className={`inline-block py-0.5 px-2 rounded-full font-bold text-[9px] ${getBadgeClass(item.estado)}`}>
                                      {item.estado}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <button 
                                      onClick={() => {
                                        setSelectedReport(item);
                                        setPage("admin_details");
                                      }}
                                      className="p-1 px-2.5 bg-slate-100 hover:bg-[#009a44] hover:text-white rounded text-[#009a44] border hover:border-transparent cursor-pointer flex items-center justify-center mx-auto"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: GERIR ALERTAS PÚBLICOS */}
                  {adminSubTab === "alertas" && (
                    <div className="space-y-6">
                      
                      {/* Form emit warning */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="font-extrabold text-sm text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[#009a44]" />
                          <span>Emitir Novo Alerta Público</span>
                        </h4>

                        <form onSubmit={handleCreateAlertSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-900 mb-1">Título do Alerta</label>
                              <input 
                                type="text"
                                required
                                value={newAlertForm.titulo}
                                onChange={(e) => setNewAlertForm({ ...newAlertForm, titulo: e.target.value })}
                                placeholder="ex: Novo golpe no WhatsApp"
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-900 mb-1">Tipo de Emissão</label>
                              <select 
                                value={newAlertForm.tipo}
                                onChange={(e) => setNewAlertForm({ ...newAlertForm, tipo: e.target.value as Alerta["tipo"] })}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                              >
                                <option value="Alerta">Alerta (SMS / Chamadas Falsas)</option>
                                <option value="Website Falso">Website Falso (Phishing)</option>
                                <option value="Número Suspeito">Número de burlão recorrente</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-900 mb-1">Mensagem de Prevenção e Aviso</label>
                            <textarea 
                              rows={3}
                              required
                              value={newAlertForm.descricao}
                              onChange={(e) => setNewAlertForm({ ...newAlertForm, descricao: e.target.value })}
                              placeholder="O que está a correr e quais são os conselhos práticos para a vítima comum de Moçambique."
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 resize-none"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="bg-[#009a44] hover:bg-[#007f37] text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                          >
                            DIVULGAR E EMITIR ALERTA
                          </button>
                        </form>
                      </div>

                      {/* Display Warnings log */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="font-extrabold text-sm text-slate-900 mb-4 uppercase tracking-wider">Histórico de Alertas Broadcasted</h4>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-800 font-bold border-b">
                              <tr>
                                <th className="p-3">Tipo</th>
                                <th className="p-3">Título Alerta</th>
                                <th className="p-3">Data</th>
                                <th className="p-3 text-center">Visualização</th>
                                <th className="p-3 text-center">Remover</th>
                              </tr>
                            </thead>
                            <tbody>
                              {alertas.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="text-center py-6 text-slate-400">Nenhum alerta público listado.</td>
                                </tr>
                              ) : (
                                alertas.map(al => (
                                  <tr key={al.id} className="border-b border-slate-150 hover:bg-slate-50">
                                    <td className="p-3">
                                      <span className="p-1 px-2.5 bg-red-50 text-red-600 font-bold rounded text-[9px] uppercase">{al.tipo}</span>
                                    </td>
                                    <td className="p-3">
                                      <strong className="block text-slate-905">{al.titulo}</strong>
                                      <span className="text-[10px] text-slate-450 block truncate max-w-sm">{al.descricao}</span>
                                    </td>
                                    <td className="p-3 text-slate-400 font-mono text-[10px]">{new Date(al.data_criacao).toLocaleDateString("pt-MZ")}</td>
                                    <td className="p-3 text-center">
                                      <button 
                                        onClick={() => toggleAlertActivity(al.id)}
                                        className={`px-3 py-1 rounded-full text-[9px] font-bold ${
                                          al.ativo ? "bg-green-150 text-green-700 border border-green-300" : "bg-slate-150 text-slate-600 border"
                                        }`}
                                      >
                                        {al.ativo ? "Ativo (No site)" : "Ocultado"}
                                      </button>
                                    </td>
                                    <td className="p-3 text-center">
                                      <button 
                                        onClick={() => deletePublicAlert(al.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 3: NUMEROS DE TELEFONE SUSPEITOS RANKING */}
                  {adminSubTab === "numeros" && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <h4 className="font-extrabold text-sm text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#e41b1d] stroke-[2.5]" />
                        <span>Ficha Coletora de Números Suspeitos / Burlões</span>
                      </h4>
                      <p className="text-slate-500 text-xs mb-4">Esta lista agrupa de forma dinâmica todos os números reportados e seus respetivos volumes de reincidências ocorrentes.</p>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-800 font-bold border-b">
                            <tr>
                              <th className="p-3">Número Fraudulento</th>
                              <th className="p-3">Tipo Frequente</th>
                              <th className="p-3 text-center font-mono">Total Ocorrências</th>
                              <th className="p-3">Última Data</th>
                              <th className="p-3 text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {phoneRanking.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="text-center py-6 text-slate-400">Nenhum número de telefone suspeito reportado até agora.</td>
                              </tr>
                            ) : (
                              phoneRanking.map(pr => (
                                <tr key={pr.number} className="border-b border-slate-150 hover:bg-slate-50">
                                  <td className="p-3 font-mono font-bold text-red-600 tracking-wider text-sm">{pr.number}</td>
                                  <td className="p-3">{pr.tipo}</td>
                                  <td className="p-3 text-center font-mono text-sm font-bold text-slate-905">{pr.oco}</td>
                                  <td className="p-3 font-mono text-slate-450">{new Date(pr.last).toLocaleDateString("pt-MZ")}</td>
                                  <td className="p-3 text-center">
                                    <button 
                                      onClick={() => {
                                        setSearchFilterKeyword(pr.number);
                                        setAdminSubTab("denuncias");
                                        showNotification(`Filtrando por: ${pr.number}`);
                                      }}
                                      className="text-xs bg-slate-100 hover:bg-[#009a44] hover:text-white border px-3 py-1 rounded-lg"
                                    >
                                      Ver Casos
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* 7. VIEW: ADMIN CASE SHEET DETAILS OVERVIEW */}
        {/* ==================================================================== */}
        {page === "admin_details" && selectedReport && (
          <section className="py-8 bg-slate-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              
              {/* Back links */}
              <button 
                onClick={() => setPage("admin_dashboard")}
                className="flex items-center gap-2 text-xs text-slate-400 font-bold hover:text-slate-600 mb-6 uppercase inline-block cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Dashboard Administrativo</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Detailed card block (Col 8) */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                    
                    {/* Header Details */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-5 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">CÓDIGO DIGITAL DO CASO</span>
                        <h4 className="text-xl font-bold font-mono text-slate-800 uppercase tracking-widest">{selectedReport.codigo_rastreio}</h4>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block mb-1">DATA DE TRIAGEM</span>
                        <span className={`inline-block py-1 px-4 rounded-full text-xs font-bold ${getBadgeClass(selectedReport.estado)}`}>
                          {selectedReport.estado}
                        </span>
                      </div>
                    </div>

                    <h5 className="font-extrabold text-sm text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-4 h-4 text-[#009a44]" />
                      <span>Ficha Completa do Incidente</span>
                    </h5>

                    {/* Meta properties list grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border p-4 rounded-xl mb-6 text-xs shadow-inner">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">CATEGORIA</span>
                        <strong className="text-sm text-slate-800 font-sans block">{selectedReport.tipo_burla}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">DATA INCIDENTE OCORREU</span>
                        <strong className="text-sm text-slate-800 font-sans block">{new Date(selectedReport.data_incidente).toLocaleDateString("pt-MZ")}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">VALOR ENVOLVIDO</span>
                        <strong className="text-sm text-green-700 font-mono block">{formatMZN(selectedReport.valor_envolvido)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">SIM/NÚMERO DO BURLÃO</span>
                        <strong className="text-sm text-red-650 font-mono block font-bold">{selectedReport.numero_suspeito || "Nenhuma informação fornecida"}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">EMAIL CONTATO TESTEMUNHA</span>
                        <strong className="text-xs text-slate-850 font-sans block truncate">{selectedReport.email_denunciante || "Anónimo Absoluto"}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">SIMULATED ORIGEM IP</span>
                        <strong className="text-xs text-slate-400 font-mono font-medium block">{selectedReport.ip_origem}</strong>
                      </div>
                    </div>

                    {/* Complaint Relato body */}
                    <div className="mb-6">
                      <h5 className="font-extrabold text-sm text-slate-900 mb-2 uppercase tracking-wider">Histórico Reclamado</h5>
                      <div className="p-4 bg-slate-50 border rounded-xl text-slate-805 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
                        {selectedReport.descricao}
                      </div>
                    </div>

                    {/* Attachment files upload */}
                    <div>
                      <h5 className="font-extrabold text-sm text-slate-900 mb-3 uppercase tracking-wider">Documentos Provas Anexos</h5>
                      {selectedReport.anexo_nome ? (
                        <div className="p-3.5 bg-slate-50 border rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2.5 text-xs truncate">
                            <FileText className="w-5 h-5 text-red-600" />
                            <div className="truncate">
                              <strong className="block text-slate-805 truncate">{selectedReport.anexo_nome}</strong>
                              <span className="text-[10px] text-slate-400 font-mono">{selectedReport.anexo_tamanho} - {selectedReport.anexo_tipo}</span>
                            </div>
                          </div>
                          <a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); showNotification("Descarregamento do ficheiro simulado com sucesso!"); }}
                            className="text-[#009a44] hover:text-[#007f37] font-semibold text-xs inline-flex items-center gap-1.5"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Descarregar</span>
                          </a>
                        </div>
                      ) : (
                        <div className="p-4 border border-dashed rounded-xl text-center text-slate-450 text-xs">
                          Nenhum anexo foi carregado por este reclamante anónimo.
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Left side actions box (Col 4) */}
                <div className="lg:col-span-4">
                  
                  {/* Status update box */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-4">
                    <h5 className="font-extrabold text-[#111] text-xs uppercase tracking-wider mb-2 font-mono">Modificar Estado</h5>
                    <p className="text-[11px] text-slate-450 leading-relaxed mb-4">A alteração reflete instantaneamente consultas públicas do cidadão.</p>
                    
                    <div className="flex flex-col gap-2">
                      {(["Em Análise", "Confirmada", "Em Investigação", "Resolvida", "Rejeitada"] as Denuncia["estado"][]).map(st => (
                        <button 
                          key={st}
                          onClick={() => updateComplaintStatus(st)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between border ${
                            selectedReport.estado === st 
                              ? "bg-red-700 text-white border-transparent" 
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <span>{st}</span>
                          {selectedReport.estado === st && <CheckCircle className="w-4 h-4 text-amber-500" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exclude/Delete action */}
                  <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm">
                    <h5 className="font-extrabold text-red-750 text-xs uppercase tracking-wider mb-2 font-mono">Ações Críticas</h5>
                    <p className="text-[11px] text-slate-450 leading-relaxed mb-4">Utilizar apenas se for identificado que o envio trata-se de spam malicioso.</p>
                    
                    <button 
                      onClick={() => deleteCaseFile(selectedReport.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir do Aparelho</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* BIBLIOTECA DE BURLAS */}
        {/* ==================================================================== */}
        {page === "biblioteca" && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-300 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-8 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-zinc-900 text-red-500 border border-zinc-700/50 rounded-full uppercase tracking-widest mb-3 font-mono">
                  <BookOpen className="w-3.5 h-3.5" />
                  Manual Cívico de Cibersegurança
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">Biblioteca de Burlas de Moçambique</h1>
                <p className="text-zinc-405 text-sm sm:text-base mt-2 max-w-2xl">
                  Aprenda a identificar antecipadamente e a repelir de forma eficaz as 6 práticas fraudulentas mais propagadas e reportadas no país.
                </p>
              </div>
              <button
                onClick={() => setPage("landing")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-850 cursor-pointer self-start md:self-center"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Início</span>
              </button>
            </div>

            {/* Grid of 6 Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  categoria: "M-Pesa / e-Mola / mKesh",
                  titulo: "Mentiras de Prémios e Códigos USSD",
                  descricao: "Chamadas e SMS falsas fingindo ser técnicos da Vodacom, mcel ou Movitel. Pedem a digitação de códigos USSD ou transferências falsas alegando lucros.",
                  comoIdentificar: [
                    "Ligações vindas de números comuns sem o prefixo institucional oficial.",
                    "Instruções para ligar para códigos USSD como *150# ou transferência urgente.",
                    "SMS forjadas de recepção de valores de remetentes comuns."
                  ],
                  comoEvitar: [
                    "Nunca efetue comandos USSD ou envie dinheiro sob instrução de desconhecidos por chamada.",
                    "Mantenha o seu código PIN secreto. Agentes reais nunca pedem o seu PIN.",
                    "Não pague qualquer verba alegadamente para 'libertação de prémios'."
                  ],
                  icone: <Smartphone className="w-6 h-6 text-red-500" />,
                  corAlerta: "border-l-red-500"
                },
                {
                  categoria: "Phishing Bancário",
                  titulo: "Clonagem de Websites e Emails",
                  descricao: "Websites fraudulentos copiados milimetricamente de portais bancários populares como Standard Bank, BIM (m-BIM), ou BCI para roubar credenciais.",
                  comoIdentificar: [
                    "Endereço de website suspeito ou incorreto (ex: bci-cliente-seguranca.com).",
                    "Mensagens forçadas exigindo 'atualização de token imediata' para evitar multas.",
                    "Surgirem janelas solicitando códigos temporários de SMS fora do fluxo correto."
                  ],
                  comoEvitar: [
                    "Nunca atalhe caminhos através de links em SMS/WhatsApp. Digite sempre o link do banco.",
                    "Certifique-se do selo de segurança SSL (ícone de cadeado) na barra de navegação.",
                    "Comunique anomalias suspeitas ao gestor de conta ou apoio de emergência."
                  ],
                  icone: <Globe className="w-6 h-6 text-amber-500" />,
                  corAlerta: "border-l-amber-500"
                },
                {
                  categoria: "Redes Sociais",
                  titulo: "Invasão e Duplicação de Perfis",
                  descricao: "Perfis falsos ou invadidos no WhatsApp, Instagram e Facebook que abordam familiares próximos pedindo dinheiros emergenciais emprestados.",
                  comoIdentificar: [
                    "Um conhecido contacta por outra conta nova urgente solicitando verba.",
                    "O tom de linguagem soa frio, distante ou apressado (com desculpas vagas).",
                    "O destinatário do dinheiro (M-Pesa/Bank) pertence a um terceiro desconhecido."
                  ],
                  comoEvitar: [
                    "Faça chamada directa de voz ou telefone por canal alternativo antes de transferir.",
                    "Configure autenticação de dois factores (2FA) em todo o seu software social.",
                    "Nunca partilhe códigos de verificação de SMS recebidos com outros utilizadores."
                  ],
                  icone: <Shield className="w-6 h-6 text-blue-500" />,
                  corAlerta: "border-l-blue-500"
                },
                {
                  categoria: "Falso Emprego",
                  titulo: "Custos de Candidatura e Provas",
                  descricao: "Ofertas e editais de empregos irresistíveis (EDM, CFM, Portos) que cobram taxas administrativas ilegais para exames médicos ou admissão.",
                  comoIdentificar: [
                    "Emails enviados através de domínios gratuitos (ex: edm.recrutamento@gmail.com).",
                    "A exigência de depósitos monetários prévios para uniformes ou triagem médica.",
                    "Contratos de admissão garantidos sem qualquer prova ou entrevista técnica prévia."
                  ],
                  comoEvitar: [
                    "Em Moçambique, concursos públicos são gratuitos. Cobrar taxas é crime punível por lei.",
                    "Vigie e reporte empresas que vendem vagas de trabalho em salas clandestinas.",
                    "Submeta candidaturas apenas nos balcões ou sites oficiais autenticados."
                  ],
                  icone: <FileText className="w-6 h-6 text-emerald-500" />,
                  corAlerta: "border-l-emerald-500"
                },
                {
                  categoria: "Falsos Investimentos",
                  titulo: "Pirâmides Financeiras e Ganhos Exorbitantes",
                  descricao: "Promessas virtuais irresistíveis que garantem rendimentos diários absurdos assentes em angariações ou falsas criptomoedas.",
                  comoIdentificar: [
                    "Retorno financeiro irrealmente alto garantido (ex: 200% em 10 dias).",
                    "Necessidade vital de angariar amigos para poder desbloquear os seus levantamentos.",
                    "Ausência total de registo legítimo no Banco de Moçambique ou entidade reguladora."
                  ],
                  comoEvitar: [
                    "Lembre-se: dinheiro fácil não existe regulado. O risco é total.",
                    "Poupe as suas economias e evite 'plataformas ou robôs fechados' que geram capital mágico.",
                    "Consulte a lista de instituições autorizadas no Banco de Moçambique."
                  ],
                  icone: <TrendingUp className="w-6 h-6 text-purple-500" />,
                  corAlerta: "border-l-purple-500"
                },
                {
                  categoria: "Comércio Falso online",
                  titulo: "Anúncios Fantasma no Facebook e OLX",
                  descricao: "Publicação de ofertas de telemóveis novos, consolas, carros ou casas por valores rebaixados, obrigando a sementes de sinal adiantadas.",
                  comoIdentificar: [
                    "Vendedor pressiona a enviar sinal imediato alegando grande procura concorrente.",
                    "Recusam-se veementemente a mostrar o artigo presencialmente primeiro.",
                    "Localização geográfica vaga ou recusa de encontro em zonas de esquadras."
                  ],
                  comoEvitar: [
                    "Não pague qualquer valor como título de reserva ou transporte antes de verificar fisicamente.",
                    "Realize transacções pessoalmente em locais públicos, concorridos e seguros.",
                    "Pague apenas após verificar a conformidade do equipamento eletrónico."
                  ],
                  icone: <ShoppingBag className="w-6 h-6 text-pink-500" />,
                  corAlerta: "border-l-pink-500"
                }
              ].map((artigo, idx) => (
                <div
                  key={idx}
                  className={`bg-zinc-900 rounded-2xl p-6 border-y border-r border-zinc-800 shadow-xl border-l-4 ${artigo.corAlerta} transition-all duration-300 hover:scale-[1.01] hover:border-zinc-700 flex flex-col justify-between`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase bg-zinc-950 px-2.5 py-1 rounded-full border border-zinc-800">
                        {artigo.categoria}
                      </span>
                      <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-850">
                        {artigo.icone}
                      </div>
                    </div>

                    <h3 className="text-md font-black text-white leading-snug mb-2 font-sans">{artigo.titulo}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-sans">{artigo.descricao}</p>

                    <div className="h-px bg-zinc-800 mb-5" />

                    {/* Como Identificar */}
                    <div className="mb-5">
                      <h4 className="flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-wider mb-2.5 font-sans">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Como Identificar?</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {artigo.comoIdentificar.map((point, pIdx) => (
                          <li key={pIdx} className="text-[11px] text-zinc-300 leading-relaxed font-sans pl-3 border-l border-red-900/40">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Como Evitar */}
                    <div className="mb-6">
                      <h4 className="flex items-center gap-1.5 text-xs font-black text-emerald-500 uppercase tracking-wider mb-2.5 font-sans">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Como Evitar?</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {artigo.comoEvitar.map((point, pIdx) => (
                          <li key={pIdx} className="text-[11px] text-zinc-300 leading-relaxed font-sans pl-3 border-l border-emerald-900/40">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const normalizedCategory = 
                        artigo.categoria.includes("M-Pesa") ? "M-Pesa/E-Mola" :
                        artigo.categoria.includes("Phishing") ? "Phishing" :
                        artigo.categoria.includes("Redes") ? "Redes Sociais" :
                        artigo.categoria.includes("Investimentos") ? "Falso Investimento" :
                        artigo.categoria.includes("Comércio") ? "Comércio Online" :
                        "Outro";
                      setFormData(prev => ({ ...prev, tipo_burla: normalizedCategory }));
                      setFormStep(1);
                      setPage("denunciar");
                      showNotification(`Categoria "${artigo.categoria}" seleccionada.`);
                    }}
                    className="w-full bg-zinc-950 text-white font-bold text-xs py-3 rounded-xl border border-zinc-800 hover:bg-zinc-850 hover:border-red-500/30 font-sans cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 text-red-500" />
                    <span>Denunciar esta Burla</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER PLATFORM */}
      <footer style={{ borderColor: "#191919" }} className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-2sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-red-500"><Shield className="w-4 h-4 inline-block align-text-top text-amber-500 mr-1.5" />SDB-MZ</span> &copy; 2026. Todos os direitos reservados.
          </div>
          
          <div className="flex gap-4 text-xs font-semibold">
            <button onClick={() => setPage("landing")} className="hover:text-white cursor-pointer">Portal Público</button>
            <button onClick={() => setPage("biblioteca")} className="hover:text-white cursor-pointer">Biblioteca de Burlas</button>
            <button onClick={() => setPage("estatisticas")} className="hover:text-white cursor-pointer">Estatísticas</button>
          </div>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* BLACKLIST PHONE CONSULTA MODAL */}
      {/* ==================================================================== */}
      {activeBlacklistPhone !== null && (() => {
        const phoneClean = activeBlacklistPhone.trim().replace(/[\s\-\+\(\)]/g, "");
        const matchingDenuncias = denuncias.filter(d => {
          const suspectClean = d.numero_suspeito?.trim().replace(/[\s\-\+\(\)]/g, "") || "";
          return suspectClean !== "" && (suspectClean.endsWith(phoneClean) || phoneClean.endsWith(suspectClean));
        });
        const totalReports = matchingDenuncias.length;

        // Calculate most frequent type
        const counts: Record<string, number> = {};
        matchingDenuncias.forEach(d => {
          counts[d.tipo_burla] = (counts[d.tipo_burla] || 0) + 1;
        });
        let mostFrequentType = "Não identificado";
        let maxCount = 0;
        Object.entries(counts).forEach(([type, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostFrequentType = type;
          }
        });

        const isHighRisk = totalReports >= 3;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all animate-scale-up text-left max-w-lg w-full relative animate-in fade-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                onClick={() => setActiveBlacklistPhone(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 hover:bg-zinc-800 rounded-full cursor-pointer flex items-center justify-center"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-zinc-800 pb-4 mb-5">
                <span className={`p-3 rounded-xl inline-block border ${
                  isHighRisk 
                    ? "bg-red-955 text-red-500 border-red-500/20 animate-pulse" 
                    : "bg-amber-950/40 text-amber-500 border-amber-500/20"
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </span>
                <div>
                  <span className={`text-[9px] font-mono block font-bold uppercase tracking-widest ${isHighRisk ? "text-red-500 animate-pulse" : "text-amber-500"}`}>
                    {isHighRisk ? "Ficha de Consulta: Contacto de Alto Risco" : "Ficha de Consulta: Contacto Sinalizado"}
                  </span>
                  <h4 className="text-base font-black text-white uppercase font-sans">Dados do Suspeito</h4>
                </div>
              </div>

              {/* Number Highlight */}
              <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 mb-5 text-center">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono block mb-1">CÓDIGO DE CONTACTO</span>
                <h2 className="text-2xl sm:text-3xl font-mono text-red-500 font-black tracking-wider block mb-4 select-all">{activeBlacklistPhone}</h2>
                
                <div className="grid grid-cols-2 gap-3.5 text-left">
                  <div className="bg-zinc-900 border border-zinc-850 p-3 rounded-xl">
                    <span className="text-[9px] text-zinc-500 block uppercase font-mono mb-0.5">Total de Queixas</span>
                    <strong className="text-sm font-black text-white font-mono">{totalReports}</strong>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 p-3 rounded-xl">
                    <span className="text-[9px] text-zinc-500 block uppercase font-mono mb-0.5">Burla Frequente</span>
                    <strong className="text-xs font-bold text-zinc-300 truncate block mt-0.5">{mostFrequentType}</strong>
                  </div>
                </div>
              </div>

              {/* Red / Amber community warning message */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 font-sans">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 leading-relaxed">
                  ⚠️ Este número foi reportado <strong>{totalReports} vez(es)</strong> pela comunidade através do Sistema de Denúncia de Burlas de Moçambique.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setActiveBlacklistPhone(null);
                    setSearchPhoneQuery(activeBlacklistPhone);
                    setAcompanharTab("phone");
                    setHasSearched(true);
                    setPage("acompanhar");
                  }}
                  className="flex-1 bg-red-650 hover:bg-red-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl text-center cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Ver Todos os Incidentes</span>
                </button>
                <button
                  onClick={() => setActiveBlacklistPhone(null)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold text-xs py-3.5 px-4 rounded-xl text-center cursor-pointer transition"
                >
                  Fechar Ficha
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
