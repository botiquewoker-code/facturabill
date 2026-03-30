import type { AppLanguage } from "@/features/i18n/config";

export type DashboardCopy = {
  nav: {
    home: string;
    invoices: string;
    clients: string;
    reports: string;
    profile: string;
  };
  home: {
    workspace: string;
    title: string;
    searchPlaceholder: string;
    emptyTitle: string;
    emptyDescription: string;
    createFirstInvoice: string;
  };
  settings: {
    badge: string;
    eyebrow: string;
    title: string;
    intro: string;
    companyTitle: string;
    companyDescription: string;
    accountTitle: string;
    accountDescription: string;
    businessData: string;
    businessDataDescription: string;
    templates: string;
    templatesDescription: string;
    taxSettings: string;
    taxSettingsDescription: string;
    paymentMethods: string;
    paymentMethodsDescription: string;
    clientCommunication: string;
    clientCommunicationDescription: string;
    subscription: string;
    subscriptionDescription: string;
    languageRegion: string;
    languageRegionDescription: string;
    accountActions: string;
    accountActionsDescription: string;
    languageSheetTitle: string;
    languageSheetDescription: string;
    currentLanguage: string;
  };
  company: {
    workspace: string;
    title: string;
    subtitle: string;
    saveProfileAria: string;
    profileSaved: string;
    unableSave: string;
    businessProfile: string;
    localSync: string;
    template: string;
    logo: string;
    notes: string;
    ready: string;
    pending: string;
    added: string;
    empty: string;
    invoiceStyle: string;
    pickTemplate: string;
    classic: string;
    classicDescription: string;
    elegant: string;
    elegantDescription: string;
    selected: string;
    choose: string;
    brandAssets: string;
    uploadLogo: string;
    logoReady: string;
    replaceLogo: string;
    addLogo: string;
    addLogoDescription: string;
    businessDetails: string;
    companyInformation: string;
    companyName: string;
    taxId: string;
    address: string;
    city: string;
    postalCode: string;
    email: string;
    phone: string;
    invoiceNotes: string;
    footerDetails: string;
    notesPlaceholder: string;
    actions: string;
    saveAndContinue: string;
    saveProfile: string;
    backHome: string;
    yourBusiness: string;
  };
};

export const dashboardCopy: Record<AppLanguage, DashboardCopy> = {
  es: {
    nav: {
      home: "Inicio",
      invoices: "Facturas",
      clients: "Clientes",
      reports: "Informes",
      profile: "Perfil",
    },
    home: {
      workspace: "Espacio",
      title: "Panel",
      searchPlaceholder: "Buscar facturas, clientes o borradores",
      emptyTitle: "Todavia no hay nada",
      emptyDescription:
        "Crea tu primer documento para empezar a construir una linea clara de facturas, borradores y actividad de clientes.",
      createFirstInvoice: "Crear primera factura",
    },
    settings: {
      badge: "Perfil",
      eyebrow: "Espacio de trabajo",
      title: "Ajustes",
      intro:
        "Una vista simple para ordenar configuracion de empresa, cobro y cuenta sin sobrecargar la pantalla.",
      companyTitle: "Empresa",
      companyDescription: "Base del negocio y configuracion principal del documento.",
      accountTitle: "Cuenta",
      accountDescription: "Preferencias generales del espacio y configuracion personal.",
      businessData: "Datos de empresa",
      businessDataDescription: "Razon social, logo, pie de factura y datos legales.",
      templates: "Plantillas",
      templatesDescription: "Estilo visual y estructura de los documentos.",
      taxSettings: "Configuracion fiscal",
      taxSettingsDescription: "IVA, impuestos y reglas para futuras facturas.",
      paymentMethods: "Metodos de cobro",
      paymentMethodsDescription: "Cuentas, instrucciones y opciones de pago.",
      clientCommunication: "Comunicacion con clientes",
      clientCommunicationDescription: "Mensajes y textos por defecto para el envio.",
      subscription: "Suscripcion",
      subscriptionDescription: "Plan actual y evolucion del servicio.",
      languageRegion: "Idioma y region",
      languageRegionDescription: "Idioma de la interfaz y formato regional.",
      accountActions: "Acciones de cuenta",
      accountActionsDescription: "Exportacion, acceso y acciones administrativas.",
      languageSheetTitle: "Seleccionar idioma",
      languageSheetDescription: "El cambio se aplica al instante en la interfaz conectada.",
      currentLanguage: "Idioma actual",
    },
    company: {
      workspace: "Espacio",
      title: "Perfil",
      subtitle:
        "Gestiona la identidad de tu empresa, el estilo de factura y los datos usados en el espacio de trabajo.",
      saveProfileAria: "Guardar perfil",
      profileSaved: "Perfil guardado",
      unableSave: "No se pudo guardar el perfil",
      businessProfile: "Perfil de negocio",
      localSync: "Sincronizacion local",
      template: "Plantilla",
      logo: "Logo",
      notes: "Notas",
      ready: "Listo",
      pending: "Pendiente",
      added: "Anadido",
      empty: "Vacio",
      invoiceStyle: "Estilo de factura",
      pickTemplate: "Elegir plantilla",
      classic: "Clasica",
      classicDescription: "Estructurada y familiar",
      elegant: "Elegante",
      elegantDescription: "Minima y editorial",
      selected: "Seleccionada",
      choose: "Elegir",
      brandAssets: "Marca",
      uploadLogo: "Sube tu logo",
      logoReady: "Logo listo",
      replaceLogo: "Toca aqui para reemplazar la imagen actual.",
      addLogo: "Anadir logo",
      addLogoDescription:
        "PNG o JPG hasta 2MB. Tu logo aparecera en las exportaciones de facturas.",
      businessDetails: "Datos de negocio",
      companyInformation: "Informacion de la empresa",
      companyName: "Nombre de empresa",
      taxId: "NIF",
      address: "Direccion",
      city: "Ciudad",
      postalCode: "Codigo postal",
      email: "Email",
      phone: "Telefono",
      invoiceNotes: "Notas de factura",
      footerDetails: "Pie e instrucciones de pago",
      notesPlaceholder:
        "Anade condiciones de pago, IBAN, instrucciones de transferencia o cualquier nota para el pie de factura...",
      actions: "Acciones",
      saveAndContinue: "Guardar y continuar",
      saveProfile: "Guardar perfil",
      backHome: "Volver al inicio",
      yourBusiness: "Tu empresa",
    },
  },
  en: {
    nav: {
      home: "Home",
      invoices: "Invoices",
      clients: "Clients",
      reports: "Reports",
      profile: "Profile",
    },
    home: {
      workspace: "Workspace",
      title: "Dashboard",
      searchPlaceholder: "Search invoices, clients, or drafts",
      emptyTitle: "Nothing here yet",
      emptyDescription:
        "Create your first document to start building a clean timeline of invoices, drafts, and client activity.",
      createFirstInvoice: "Create first invoice",
    },
    settings: {
      badge: "Profile",
      eyebrow: "Workspace",
      title: "Settings",
      intro:
        "A simple view to organise company, billing, and account settings without overloading the screen.",
      companyTitle: "Company",
      companyDescription: "Business foundation and main document configuration.",
      accountTitle: "Account",
      accountDescription: "General workspace preferences and personal settings.",
      businessData: "Business data",
      businessDataDescription: "Company details, logo, invoice footer, and legal info.",
      templates: "Templates",
      templatesDescription: "Visual style and document structure.",
      taxSettings: "Tax settings",
      taxSettingsDescription: "VAT, taxes, and rules for future invoices.",
      paymentMethods: "Payment methods",
      paymentMethodsDescription: "Accounts, instructions, and payment options.",
      clientCommunication: "Client communication",
      clientCommunicationDescription: "Default messages and sending copy.",
      subscription: "Subscription",
      subscriptionDescription: "Current plan and service growth.",
      languageRegion: "Language and region",
      languageRegionDescription: "Interface language and regional format.",
      accountActions: "Account actions",
      accountActionsDescription: "Export, access, and admin actions.",
      languageSheetTitle: "Select language",
      languageSheetDescription: "The change is applied instantly across the connected interface.",
      currentLanguage: "Current language",
    },
    company: {
      workspace: "Workspace",
      title: "Profile",
      subtitle:
        "Manage your company identity, invoice style, and the details used across the workspace.",
      saveProfileAria: "Save profile",
      profileSaved: "Profile saved",
      unableSave: "Unable to save profile",
      businessProfile: "Business profile",
      localSync: "Local sync",
      template: "Template",
      logo: "Logo",
      notes: "Notes",
      ready: "Ready",
      pending: "Pending",
      added: "Added",
      empty: "Empty",
      invoiceStyle: "Invoice style",
      pickTemplate: "Pick a template",
      classic: "Classic",
      classicDescription: "Structured and familiar",
      elegant: "Elegant",
      elegantDescription: "Minimal and editorial",
      selected: "Selected",
      choose: "Choose",
      brandAssets: "Brand assets",
      uploadLogo: "Upload your logo",
      logoReady: "Logo ready",
      replaceLogo: "Tap here to replace the current image.",
      addLogo: "Add a logo",
      addLogoDescription:
        "PNG or JPG up to 2MB. Your logo will appear in invoice exports.",
      businessDetails: "Business details",
      companyInformation: "Company information",
      companyName: "Company name",
      taxId: "Tax ID",
      address: "Address",
      city: "City",
      postalCode: "Postal code",
      email: "Email",
      phone: "Phone",
      invoiceNotes: "Invoice notes",
      footerDetails: "Footer and payment details",
      notesPlaceholder:
        "Add payment terms, IBAN, transfer instructions, or any invoice footer note...",
      actions: "Actions",
      saveAndContinue: "Save and continue",
      saveProfile: "Save profile",
      backHome: "Back home",
      yourBusiness: "Your business",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      invoices: "Factures",
      clients: "Clients",
      reports: "Rapports",
      profile: "Profil",
    },
    home: {
      workspace: "Espace",
      title: "Tableau",
      searchPlaceholder: "Rechercher des factures, clients ou brouillons",
      emptyTitle: "Rien pour le moment",
      emptyDescription:
        "Créez votre premier document pour démarrer une chronologie claire de factures, brouillons et activité client.",
      createFirstInvoice: "Créer la première facture",
    },
    settings: {
      badge: "Profil",
      eyebrow: "Espace de travail",
      title: "Réglages",
      intro:
        "Une vue simple pour organiser société, facturation et compte sans surcharger l’écran.",
      companyTitle: "Société",
      companyDescription: "Base de l’entreprise et configuration principale du document.",
      accountTitle: "Compte",
      accountDescription: "Préférences générales de l’espace et réglages personnels.",
      businessData: "Données de l’entreprise",
      businessDataDescription: "Société, logo, pied de facture et informations légales.",
      templates: "Modèles",
      templatesDescription: "Style visuel et structure des documents.",
      taxSettings: "Paramètres fiscaux",
      taxSettingsDescription: "TVA, taxes et règles pour les futures factures.",
      paymentMethods: "Moyens de paiement",
      paymentMethodsDescription: "Comptes, instructions et options de paiement.",
      clientCommunication: "Communication client",
      clientCommunicationDescription: "Messages par défaut et textes d’envoi.",
      subscription: "Abonnement",
      subscriptionDescription: "Plan actuel et évolution du service.",
      languageRegion: "Langue et région",
      languageRegionDescription: "Langue de l’interface et format régional.",
      accountActions: "Actions du compte",
      accountActionsDescription: "Export, accès et actions administratives.",
      languageSheetTitle: "Choisir la langue",
      languageSheetDescription: "Le changement s’applique immédiatement sur l’interface connectée.",
      currentLanguage: "Langue actuelle",
    },
    company: {
      workspace: "Espace",
      title: "Profil",
      subtitle:
        "Gérez l’identité de votre entreprise, le style de facture et les données utilisées dans l’espace.",
      saveProfileAria: "Enregistrer le profil",
      profileSaved: "Profil enregistré",
      unableSave: "Impossible d’enregistrer le profil",
      businessProfile: "Profil d’entreprise",
      localSync: "Synchronisation locale",
      template: "Modèle",
      logo: "Logo",
      notes: "Notes",
      ready: "Prêt",
      pending: "En attente",
      added: "Ajouté",
      empty: "Vide",
      invoiceStyle: "Style de facture",
      pickTemplate: "Choisir un modèle",
      classic: "Classique",
      classicDescription: "Structuré et familier",
      elegant: "Élégant",
      elegantDescription: "Minimal et éditorial",
      selected: "Sélectionné",
      choose: "Choisir",
      brandAssets: "Identité",
      uploadLogo: "Téléverser le logo",
      logoReady: "Logo prêt",
      replaceLogo: "Touchez ici pour remplacer l’image actuelle.",
      addLogo: "Ajouter un logo",
      addLogoDescription:
        "PNG ou JPG jusqu’à 2 Mo. Votre logo apparaîtra dans les exports de factures.",
      businessDetails: "Détails de l’entreprise",
      companyInformation: "Informations de l’entreprise",
      companyName: "Nom de l’entreprise",
      taxId: "Identifiant fiscal",
      address: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      email: "Email",
      phone: "Téléphone",
      invoiceNotes: "Notes de facture",
      footerDetails: "Pied de page et détails de paiement",
      notesPlaceholder:
        "Ajoutez conditions de paiement, IBAN, instructions de virement ou toute note de pied de facture...",
      actions: "Actions",
      saveAndContinue: "Enregistrer et continuer",
      saveProfile: "Enregistrer le profil",
      backHome: "Retour à l’accueil",
      yourBusiness: "Votre entreprise",
    },
  },
  it: {
    nav: {
      home: "Home",
      invoices: "Fatture",
      clients: "Clienti",
      reports: "Report",
      profile: "Profilo",
    },
    home: {
      workspace: "Spazio",
      title: "Dashboard",
      searchPlaceholder: "Cerca fatture, clienti o bozze",
      emptyTitle: "Ancora niente",
      emptyDescription:
        "Crea il tuo primo documento per iniziare una timeline chiara di fatture, bozze e attività clienti.",
      createFirstInvoice: "Crea prima fattura",
    },
    settings: {
      badge: "Profilo",
      eyebrow: "Spazio di lavoro",
      title: "Impostazioni",
      intro:
        "Una vista semplice per organizzare azienda, fatturazione e account senza appesantire lo schermo.",
      companyTitle: "Azienda",
      companyDescription: "Base dell’attività e configurazione principale del documento.",
      accountTitle: "Account",
      accountDescription: "Preferenze generali dello spazio e impostazioni personali.",
      businessData: "Dati azienda",
      businessDataDescription: "Ragione sociale, logo, piè di fattura e dati legali.",
      templates: "Modelli",
      templatesDescription: "Stile visivo e struttura dei documenti.",
      taxSettings: "Impostazioni fiscali",
      taxSettingsDescription: "IVA, tasse e regole per le future fatture.",
      paymentMethods: "Metodi di pagamento",
      paymentMethodsDescription: "Conti, istruzioni e opzioni di pagamento.",
      clientCommunication: "Comunicazione clienti",
      clientCommunicationDescription: "Messaggi predefiniti e testi di invio.",
      subscription: "Abbonamento",
      subscriptionDescription: "Piano attuale ed evoluzione del servizio.",
      languageRegion: "Lingua e regione",
      languageRegionDescription: "Lingua dell’interfaccia e formato regionale.",
      accountActions: "Azioni account",
      accountActionsDescription: "Esportazione, accesso e azioni amministrative.",
      languageSheetTitle: "Seleziona lingua",
      languageSheetDescription: "La modifica si applica subito all’interfaccia collegata.",
      currentLanguage: "Lingua attuale",
    },
    company: {
      workspace: "Spazio",
      title: "Profilo",
      subtitle:
        "Gestisci identità aziendale, stile fattura e dati usati nello spazio di lavoro.",
      saveProfileAria: "Salva profilo",
      profileSaved: "Profilo salvato",
      unableSave: "Impossibile salvare il profilo",
      businessProfile: "Profilo aziendale",
      localSync: "Sincronizzazione locale",
      template: "Modello",
      logo: "Logo",
      notes: "Note",
      ready: "Pronto",
      pending: "In attesa",
      added: "Aggiunto",
      empty: "Vuoto",
      invoiceStyle: "Stile fattura",
      pickTemplate: "Scegli modello",
      classic: "Classico",
      classicDescription: "Strutturato e familiare",
      elegant: "Elegante",
      elegantDescription: "Minimale ed editoriale",
      selected: "Selezionato",
      choose: "Scegli",
      brandAssets: "Brand",
      uploadLogo: "Carica logo",
      logoReady: "Logo pronto",
      replaceLogo: "Tocca qui per sostituire l’immagine attuale.",
      addLogo: "Aggiungi logo",
      addLogoDescription:
        "PNG o JPG fino a 2MB. Il logo apparira nelle esportazioni di fattura.",
      businessDetails: "Dati aziendali",
      companyInformation: "Informazioni azienda",
      companyName: "Nome azienda",
      taxId: "Partita IVA",
      address: "Indirizzo",
      city: "Citta",
      postalCode: "CAP",
      email: "Email",
      phone: "Telefono",
      invoiceNotes: "Note fattura",
      footerDetails: "Piè di pagina e dettagli pagamento",
      notesPlaceholder:
        "Aggiungi termini di pagamento, IBAN, istruzioni di bonifico o qualsiasi nota per il piè di fattura...",
      actions: "Azioni",
      saveAndContinue: "Salva e continua",
      saveProfile: "Salva profilo",
      backHome: "Torna alla home",
      yourBusiness: "La tua azienda",
    },
  },
  nl: {
    nav: {
      home: "Start",
      invoices: "Facturen",
      clients: "Klanten",
      reports: "Rapporten",
      profile: "Profiel",
    },
    home: {
      workspace: "Werkruimte",
      title: "Dashboard",
      searchPlaceholder: "Zoek facturen, klanten of concepten",
      emptyTitle: "Nog niets hier",
      emptyDescription:
        "Maak je eerste document om een duidelijke tijdlijn van facturen, concepten en klantactiviteit op te bouwen.",
      createFirstInvoice: "Eerste factuur maken",
    },
    settings: {
      badge: "Profiel",
      eyebrow: "Werkruimte",
      title: "Instellingen",
      intro:
        "Een eenvoudige weergave om bedrijf, facturatie en account te organiseren zonder het scherm te overladen.",
      companyTitle: "Bedrijf",
      companyDescription: "Zakelijke basis en hoofdconfiguratie van documenten.",
      accountTitle: "Account",
      accountDescription: "Algemene voorkeuren van de werkruimte en persoonlijke instellingen.",
      businessData: "Bedrijfsgegevens",
      businessDataDescription: "Bedrijfsgegevens, logo, factuurvoet en juridische info.",
      templates: "Sjablonen",
      templatesDescription: "Visuele stijl en documentstructuur.",
      taxSettings: "Belastinginstellingen",
      taxSettingsDescription: "Btw, belastingen en regels voor toekomstige facturen.",
      paymentMethods: "Betaalmethoden",
      paymentMethodsDescription: "Rekeningen, instructies en betaalopties.",
      clientCommunication: "Klantcommunicatie",
      clientCommunicationDescription: "Standaardberichten en verzendteksten.",
      subscription: "Abonnement",
      subscriptionDescription: "Huidig plan en groei van de dienst.",
      languageRegion: "Taal en regio",
      languageRegionDescription: "Taal van de interface en regionaal formaat.",
      accountActions: "Accountacties",
      accountActionsDescription: "Export, toegang en beheeracties.",
      languageSheetTitle: "Taal kiezen",
      languageSheetDescription: "De wijziging wordt direct toegepast op de gekoppelde interface.",
      currentLanguage: "Huidige taal",
    },
    company: {
      workspace: "Werkruimte",
      title: "Profiel",
      subtitle:
        "Beheer je bedrijfsidentiteit, factuurstijl en gegevens die in de werkruimte worden gebruikt.",
      saveProfileAria: "Profiel opslaan",
      profileSaved: "Profiel opgeslagen",
      unableSave: "Profiel kon niet worden opgeslagen",
      businessProfile: "Bedrijfsprofiel",
      localSync: "Lokale synchronisatie",
      template: "Sjabloon",
      logo: "Logo",
      notes: "Notities",
      ready: "Klaar",
      pending: "In behandeling",
      added: "Toegevoegd",
      empty: "Leeg",
      invoiceStyle: "Factuurstijl",
      pickTemplate: "Kies een sjabloon",
      classic: "Klassiek",
      classicDescription: "Gestructureerd en vertrouwd",
      elegant: "Elegant",
      elegantDescription: "Minimalistisch en editoriaal",
      selected: "Geselecteerd",
      choose: "Kiezen",
      brandAssets: "Merkmiddelen",
      uploadLogo: "Logo uploaden",
      logoReady: "Logo klaar",
      replaceLogo: "Tik hier om de huidige afbeelding te vervangen.",
      addLogo: "Logo toevoegen",
      addLogoDescription:
        "PNG of JPG tot 2MB. Je logo verschijnt in factuurexports.",
      businessDetails: "Bedrijfsgegevens",
      companyInformation: "Bedrijfsinformatie",
      companyName: "Bedrijfsnaam",
      taxId: "Btw-nummer",
      address: "Adres",
      city: "Stad",
      postalCode: "Postcode",
      email: "E-mail",
      phone: "Telefoon",
      invoiceNotes: "Factuurnotities",
      footerDetails: "Voettekst en betaalgegevens",
      notesPlaceholder:
        "Voeg betaalvoorwaarden, IBAN, overschrijvingsinstructies of een factuurnoot toe...",
      actions: "Acties",
      saveAndContinue: "Opslaan en doorgaan",
      saveProfile: "Profiel opslaan",
      backHome: "Terug naar start",
      yourBusiness: "Je bedrijf",
    },
  },
  pt: {
    nav: {
      home: "Início",
      invoices: "Faturas",
      clients: "Clientes",
      reports: "Relatórios",
      profile: "Perfil",
    },
    home: {
      workspace: "Espaço",
      title: "Painel",
      searchPlaceholder: "Procurar faturas, clientes ou rascunhos",
      emptyTitle: "Ainda não há nada",
      emptyDescription:
        "Crie o seu primeiro documento para começar uma linha clara de faturas, rascunhos e atividade de clientes.",
      createFirstInvoice: "Criar primeira fatura",
    },
    settings: {
      badge: "Perfil",
      eyebrow: "Espaço de trabalho",
      title: "Definições",
      intro:
        "Uma vista simples para organizar empresa, faturação e conta sem sobrecarregar o ecrã.",
      companyTitle: "Empresa",
      companyDescription: "Base do negócio e configuração principal do documento.",
      accountTitle: "Conta",
      accountDescription: "Preferências gerais do espaço e definições pessoais.",
      businessData: "Dados da empresa",
      businessDataDescription: "Empresa, logótipo, rodapé da fatura e dados legais.",
      templates: "Modelos",
      templatesDescription: "Estilo visual e estrutura dos documentos.",
      taxSettings: "Configuração fiscal",
      taxSettingsDescription: "IVA, impostos e regras para futuras faturas.",
      paymentMethods: "Métodos de pagamento",
      paymentMethodsDescription: "Contas, instruções e opções de pagamento.",
      clientCommunication: "Comunicação com clientes",
      clientCommunicationDescription: "Mensagens por defeito e textos de envio.",
      subscription: "Subscrição",
      subscriptionDescription: "Plano atual e evolução do serviço.",
      languageRegion: "Idioma e região",
      languageRegionDescription: "Idioma da interface e formato regional.",
      accountActions: "Ações da conta",
      accountActionsDescription: "Exportação, acesso e ações administrativas.",
      languageSheetTitle: "Selecionar idioma",
      languageSheetDescription: "A alteração aplica-se de imediato na interface ligada.",
      currentLanguage: "Idioma atual",
    },
    company: {
      workspace: "Espaço",
      title: "Perfil",
      subtitle:
        "Gira a identidade da empresa, o estilo de fatura e os dados usados no espaço de trabalho.",
      saveProfileAria: "Guardar perfil",
      profileSaved: "Perfil guardado",
      unableSave: "Não foi possível guardar o perfil",
      businessProfile: "Perfil do negócio",
      localSync: "Sincronização local",
      template: "Modelo",
      logo: "Logótipo",
      notes: "Notas",
      ready: "Pronto",
      pending: "Pendente",
      added: "Adicionado",
      empty: "Vazio",
      invoiceStyle: "Estilo da fatura",
      pickTemplate: "Escolher modelo",
      classic: "Clássica",
      classicDescription: "Estruturada e familiar",
      elegant: "Elegante",
      elegantDescription: "Mínima e editorial",
      selected: "Selecionado",
      choose: "Escolher",
      brandAssets: "Marca",
      uploadLogo: "Carregar logótipo",
      logoReady: "Logótipo pronto",
      replaceLogo: "Toque aqui para substituir a imagem atual.",
      addLogo: "Adicionar logótipo",
      addLogoDescription:
        "PNG ou JPG até 2MB. O logótipo aparece nas exportações de faturas.",
      businessDetails: "Dados do negócio",
      companyInformation: "Informação da empresa",
      companyName: "Nome da empresa",
      taxId: "NIF",
      address: "Morada",
      city: "Cidade",
      postalCode: "Código postal",
      email: "Email",
      phone: "Telefone",
      invoiceNotes: "Notas da fatura",
      footerDetails: "Rodapé e dados de pagamento",
      notesPlaceholder:
        "Adicione condições de pagamento, IBAN, instruções de transferência ou qualquer nota para o rodapé da fatura...",
      actions: "Ações",
      saveAndContinue: "Guardar e continuar",
      saveProfile: "Guardar perfil",
      backHome: "Voltar ao início",
      yourBusiness: "A sua empresa",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      invoices: "الفواتير",
      clients: "العملاء",
      reports: "التقارير",
      profile: "الملف",
    },
    home: {
      workspace: "مساحة العمل",
      title: "لوحة التحكم",
      searchPlaceholder: "ابحث عن الفواتير أو العملاء أو المسودات",
      emptyTitle: "لا يوجد شيء بعد",
      emptyDescription:
        "أنشئ أول مستند لبدء خط زمني واضح للفواتير والمسودات ونشاط العملاء.",
      createFirstInvoice: "إنشاء أول فاتورة",
    },
    settings: {
      badge: "الملف",
      eyebrow: "مساحة العمل",
      title: "الإعدادات",
      intro:
        "واجهة بسيطة لتنظيم الشركة والفوترة والحساب بدون ازدحام بصري.",
      companyTitle: "الشركة",
      companyDescription: "أساس العمل والإعداد الرئيسي للمستندات.",
      accountTitle: "الحساب",
      accountDescription: "تفضيلات عامة للمساحة وإعدادات شخصية.",
      businessData: "بيانات الشركة",
      businessDataDescription: "بيانات الشركة والشعار وتذييل الفاتورة والمعلومات القانونية.",
      templates: "القوالب",
      templatesDescription: "الأسلوب البصري وبنية المستندات.",
      taxSettings: "الإعدادات الضريبية",
      taxSettingsDescription: "الضريبة والقواعد الخاصة بالفواتير القادمة.",
      paymentMethods: "طرق الدفع",
      paymentMethodsDescription: "الحسابات والتعليمات وخيارات الدفع.",
      clientCommunication: "التواصل مع العملاء",
      clientCommunicationDescription: "الرسائل الافتراضية ونصوص الإرسال.",
      subscription: "الاشتراك",
      subscriptionDescription: "الخطة الحالية وتطور الخدمة.",
      languageRegion: "اللغة والمنطقة",
      languageRegionDescription: "لغة الواجهة والتنسيق الإقليمي.",
      accountActions: "إجراءات الحساب",
      accountActionsDescription: "التصدير والوصول والإجراءات الإدارية.",
      languageSheetTitle: "اختيار اللغة",
      languageSheetDescription: "يتم تطبيق التغيير فوراً على الواجهة المتصلة.",
      currentLanguage: "اللغة الحالية",
    },
    company: {
      workspace: "مساحة العمل",
      title: "الملف",
      subtitle:
        "إدارة هوية الشركة ونمط الفاتورة والبيانات المستخدمة في مساحة العمل.",
      saveProfileAria: "حفظ الملف",
      profileSaved: "تم حفظ الملف",
      unableSave: "تعذر حفظ الملف",
      businessProfile: "ملف العمل",
      localSync: "مزامنة محلية",
      template: "القالب",
      logo: "الشعار",
      notes: "ملاحظات",
      ready: "جاهز",
      pending: "قيد الانتظار",
      added: "مضاف",
      empty: "فارغ",
      invoiceStyle: "نمط الفاتورة",
      pickTemplate: "اختر قالباً",
      classic: "كلاسيكي",
      classicDescription: "منظم ومألوف",
      elegant: "أنيق",
      elegantDescription: "بسيط وتحريري",
      selected: "محدد",
      choose: "اختيار",
      brandAssets: "هوية العلامة",
      uploadLogo: "رفع الشعار",
      logoReady: "الشعار جاهز",
      replaceLogo: "اضغط هنا لاستبدال الصورة الحالية.",
      addLogo: "إضافة شعار",
      addLogoDescription:
        "PNG أو JPG حتى 2MB. سيظهر الشعار في تصدير الفواتير.",
      businessDetails: "بيانات العمل",
      companyInformation: "معلومات الشركة",
      companyName: "اسم الشركة",
      taxId: "الرقم الضريبي",
      address: "العنوان",
      city: "المدينة",
      postalCode: "الرمز البريدي",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      invoiceNotes: "ملاحظات الفاتورة",
      footerDetails: "التذييل وبيانات الدفع",
      notesPlaceholder:
        "أضف شروط الدفع أو IBAN أو تعليمات التحويل أو أي ملاحظة لتذييل الفاتورة...",
      actions: "الإجراءات",
      saveAndContinue: "حفظ ومتابعة",
      saveProfile: "حفظ الملف",
      backHome: "العودة إلى الرئيسية",
      yourBusiness: "شركتك",
    },
  },
};
