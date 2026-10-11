// All professional content lives here (source: CV.txt). Bilingual: { es, en }.

export const profile = {
  name: 'Renato Strianese',
  headline: {
    es: 'Consultor Senior en Inteligencia Artificial y Software · Microsoft & HP',
    en: 'Senior AI & Software Consultant · Microsoft & HP',
  },
  tagline: {
    es: 'AI, Desarrollo de Software, Machine Learning y Power BI · 28+ años transformando empresas con tecnología',
    en: 'AI, Software Development, Machine Learning and Power BI · 28+ years transforming businesses through technology',
  },
  about: {
    es: [
      'Soy Ingeniero en Sistemas con especialización en Desarrollo de Aplicaciones, Inteligencia Artificial y Machine Learning, con más de 28 años de experiencia en la industria tecnológica trabajando para organizaciones globales como Microsoft y Hewlett-Packard Software.',
      'Me especializo en Inteligencia Artificial, automatización de procesos, desarrollo de aplicaciones web, análisis de datos, Machine Learning y Business Intelligence, ayudando a empresas a optimizar operaciones, reducir costos y mejorar la toma de decisiones.',
    ],
    en: [
      'I am a Systems Engineer specialized in Application Development, Artificial Intelligence and Machine Learning, with over 28 years of experience in the technology industry working for global organizations such as Microsoft and Hewlett-Packard Software.',
      'I specialize in Artificial Intelligence, process automation, web application development, data analytics, Machine Learning and Business Intelligence, helping companies optimize operations, reduce costs and improve decision making.',
    ],
  },
  philosophy: {
    es: 'Mi filosofía es simple: transparencia, compromiso y relaciones de largo plazo. No me limito a entregar una solución técnica; busco entender el negocio, aportar ideas y generar valor real para mis clientes.',
    en: 'My philosophy is simple: transparency, commitment and long-term relationships. I do not just deliver a technical solution; I seek to understand the business, contribute ideas and create real value for my clients.',
  },
  metrics: [
    { value: '28+', label: { es: 'años de experiencia', en: 'years of experience' } },
    { value: '$800K+', label: { es: 'ahorro anual con IA y automatización', en: 'annual savings through AI & automation' } },
    { value: '20+ h', label: { es: 'al mes ahorradas a equipos de gestión', en: 'saved per month for management teams' } },
    { value: '1,000+', label: { es: 'estudiantes entrenados', en: 'students trained' } },
  ],
};

// Skill orbs scattered on the map.
export const skills = [
  { name: 'ChatGPT', color: '#10a37f' },
  { name: 'Claude', color: '#d97757' },
  { name: 'Microsoft Copilot', color: '#8b6cff' },
  { name: 'Python', color: '#ffd43b' },
  { name: 'C#', color: '#b45fb0' },
  { name: 'React', color: '#61dafb' },
  { name: 'ASP.NET', color: '#6b4be0' },
  { name: 'Azure', color: '#2f97ff' },
  { name: 'Power BI', color: '#f2c811' },
  { name: 'SQL Server', color: '#e0403d' },
  { name: 'MongoDB', color: '#4cb04f' },
  { name: 'Unity', color: '#e8e8e8' },
  { name: 'Microsoft Fabric', color: '#19d3a8' },
];

export const zones = [
  { id: 'about', icon: '👤', color: '#38bdf8', title: { es: 'Sobre mí', en: 'About me' }, subtitle: { es: 'Quién soy y cómo trabajo', en: 'Who I am and how I work' } },
  { id: 'early', icon: '🌱', color: '#a3e635', title: { es: 'Inicios', en: 'Early career' }, subtitle: { es: 'SysConsulting · Accusys · ProjectSys · 1998–2005', en: 'SysConsulting · Accusys · ProjectSys · 1998–2005' } },
  { id: 'movilnet', icon: '📡', color: '#fb7185', title: { es: 'Movilnet', en: 'Movilnet' }, subtitle: { es: 'Telecomunicaciones · 2005–2010', en: 'Telecommunications · 2005–2010' } },
  { id: 'hp', icon: '🖥️', color: '#60a5fa', title: { es: 'Hewlett Packard', en: 'Hewlett Packard' }, subtitle: { es: 'HP Software · 2010–2017', en: 'HP Software · 2010–2017' } },
  { id: 'ms', icon: '🪟', color: '#34d399', title: { es: 'Microsoft', en: 'Microsoft' }, subtitle: { es: '2017 – presente', en: '2017 – present' } },
  { id: 'projects', icon: '🧪', color: '#c084fc', title: { es: 'Laboratorio de proyectos', en: 'Projects lab' }, subtitle: { es: 'Proyectos destacados y resultados', en: 'Featured projects and results' } },
  { id: 'certs', icon: '🏛️', color: '#fbbf24', title: { es: 'Museo de certificaciones', en: 'Certifications museum' }, subtitle: { es: 'Licencias y certificaciones', en: 'Licenses and certifications' } },
  { id: 'education', icon: '🎓', color: '#f472b6', title: { es: 'Universidad', en: 'University' }, subtitle: { es: 'Educación e idiomas', en: 'Education and languages' } },
  { id: 'contact', icon: '✉️', color: '#22d3ee', title: { es: 'Contacto', en: 'Contact' }, subtitle: { es: 'Hablemos', en: "Let's talk" } },
];

// Dates: 'YYYY-MM'. to: null = present.
export const companies = {
  ms: {
    roles: [
      {
        title: 'Microsoft Technical Trainer Manager', company: 'Microsoft', from: '2025-03', to: null,
        desc: {
          es: 'Lidero el equipo de Microsoft Technical Trainers para Latinoamérica y Estados Unidos, impulsando el desarrollo de capacidades técnicas en tecnologías de nube, inteligencia artificial, datos y desarrollo de software. Responsable de definir estrategias de aprendizaje, elevar el nivel técnico de los equipos y acelerar la adopción de soluciones Microsoft en organizaciones de diferentes industrias.',
          en: 'I lead the Microsoft Technical Trainers team for Latin America and the United States, driving technical skills development in cloud, artificial intelligence, data and software development. I define learning strategies, raise the technical level of teams and accelerate the adoption of Microsoft solutions across industries.',
        },
      },
      {
        title: 'Microsoft Technical Trainer', company: 'Microsoft', from: '2021-12', to: '2025-04',
        desc: {
          es: 'Diseñé e impartí programas de entrenamiento técnico especializados en Azure, Inteligencia Artificial, Datos, DevOps y Desarrollo de Aplicaciones. Ayudé a profesionales y organizaciones a adoptar nuevas tecnologías, acelerar proyectos de transformación digital y maximizar el valor de sus inversiones en la nube.',
          en: 'I designed and delivered specialized technical training programs on Azure, Artificial Intelligence, Data, DevOps and Application Development. I helped professionals and organizations adopt new technologies, accelerate digital transformation projects and maximize the value of their cloud investments.',
        },
      },
      {
        title: 'Cloud Solution Architect Manager', company: 'Microsoft', from: '2019-07', to: '2021-12',
        desc: {
          es: 'Lideré equipos de arquitectos de soluciones cloud enfocados en ayudar a organizaciones a modernizar aplicaciones, migrar cargas de trabajo a la nube e implementar estrategias de transformación digital. Fui responsable de impulsar iniciativas de alto impacto orientadas a innovación, productividad y crecimiento empresarial.',
          en: 'I led teams of cloud solution architects focused on helping organizations modernize applications, migrate workloads to the cloud and implement digital transformation strategies. I drove high-impact initiatives focused on innovation, productivity and business growth.',
        },
      },
      {
        title: 'Technical Sales Manager', company: 'Microsoft', from: '2018-01', to: '2019-06',
        desc: {
          es: 'Dirigí estrategias técnicas y comerciales para promover la adopción de soluciones Microsoft en mercados estratégicos. Trabajé estrechamente con ejecutivos y equipos de negocio para alinear la tecnología con los objetivos de crecimiento, eficiencia e innovación de las organizaciones.',
          en: 'I led technical and commercial strategies to promote the adoption of Microsoft solutions in strategic markets. I worked closely with executives and business teams to align technology with growth, efficiency and innovation goals.',
        },
      },
      {
        title: 'Technical Sales Professional', company: 'Microsoft', from: '2017-06', to: '2018-01',
        desc: {
          es: 'Asesoré a clientes empresariales en la evaluación e implementación de tecnologías Microsoft, identificando oportunidades de transformación digital mediante soluciones cloud, analítica de datos y modernización tecnológica.',
          en: 'I advised enterprise customers on evaluating and implementing Microsoft technologies, identifying digital transformation opportunities through cloud solutions, data analytics and technology modernization.',
        },
      },
    ],
  },
  hp: {
    roles: [
      {
        title: 'Software Account Executive CALA', company: 'Hewlett Packard', from: '2014-11', to: '2017-06',
        desc: {
          es: 'Gestioné relaciones estratégicas con clientes corporativos en Centroamérica y Venezuela, liderando iniciativas para la adopción de soluciones empresariales de software. Ayudé a organizaciones a mejorar sus operaciones mediante herramientas de automatización, monitoreo, seguridad y gestión de TI.',
          en: 'I managed strategic relationships with corporate customers in Central America and Venezuela, leading initiatives for the adoption of enterprise software solutions. I helped organizations improve operations through automation, monitoring, security and IT management tools.',
        },
      },
      {
        title: 'Software Account Executive Central America', company: 'Hewlett Packard', from: '2012-11', to: '2014-10',
        desc: {
          es: 'Responsable del crecimiento del negocio de HP Software en Centroamérica. Desarrollé estrategias comerciales, gestioné relaciones con ejecutivos de alto nivel y trabajé con socios tecnológicos para identificar nuevas oportunidades y acelerar la transformación tecnológica de los clientes.',
          en: 'I was responsible for growing the HP Software business in Central America. I developed commercial strategies, managed relationships with senior executives and worked with technology partners to identify new opportunities and accelerate customers’ technological transformation.',
        },
      },
      {
        title: 'HP Software Presales Solutions Architect', company: 'Hewlett Packard', from: '2010-04', to: '2012-12',
        desc: {
          es: 'Diseñé arquitecturas empresariales y soluciones tecnológicas para organizaciones de distintos sectores. Lideré procesos de consultoría técnica, demostraciones ejecutivas y definición de estrategias para la adopción de software empresarial orientado a optimizar operaciones y mejorar resultados de negocio.',
          en: 'I designed enterprise architectures and technology solutions for organizations across sectors. I led technical consulting, executive demonstrations and strategy definition for the adoption of enterprise software aimed at optimizing operations and improving business results.',
        },
      },
    ],
  },
  movilnet: {
    roles: [
      {
        title: 'Consultor de Planificación de Sistemas', company: 'Movilnet', from: '2008-01', to: '2010-03',
        desc: {
          es: 'Responsable de la planificación estratégica de plataformas tecnológicas y servicios críticos para una de las empresas de telecomunicaciones más importantes del país. Participé en iniciativas de capacidad tecnológica, continuidad de negocio y optimización operativa.',
          en: 'I was responsible for the strategic planning of technology platforms and critical services for one of the most important telecommunications companies in the country. I took part in technology capacity, business continuity and operational optimization initiatives.',
        },
      },
      {
        title: 'Consultor Senior de Soporte de Servicios Emergentes', company: 'Movilnet', from: '2005-03', to: '2007-12',
        desc: {
          es: 'Gestioné plataformas de servicios de alto impacto para millones de usuarios móviles, desarrollando soluciones de automatización y monitoreo que mejoraron la disponibilidad, estabilidad y calidad de los servicios ofrecidos por la compañía.',
          en: 'I managed high-impact service platforms for millions of mobile users, building automation and monitoring solutions that improved the availability, stability and quality of the services offered by the company.',
        },
      },
    ],
  },
  early: {
    roles: [
      {
        title: 'Senior Project Coordinator', company: 'ProjectSys', from: '2004-02', to: '2005-09',
        desc: {
          es: 'Coordiné proyectos de desarrollo e implementación de soluciones tecnológicas para clientes corporativos, principalmente del sector financiero, garantizando el cumplimiento de objetivos, tiempos y calidad de entrega.',
          en: 'I coordinated development and implementation projects of technology solutions for corporate clients, mainly in the financial sector, ensuring delivery of goals, schedules and quality.',
        },
      },
      {
        title: 'Products Specialist', company: 'Accusys', from: '2000-03', to: '2003-09',
        desc: {
          es: 'Participé en el desarrollo e implementación de soluciones tecnológicas para instituciones financieras, colaborando en proyectos relacionados con banca, recursos humanos y sistemas transaccionales críticos para el negocio.',
          en: 'I took part in the development and implementation of technology solutions for financial institutions, working on banking, human resources and business-critical transactional systems projects.',
        },
      },
      {
        title: 'Senior Systems Analyst', company: 'SysConsulting', from: '1998-03', to: '2000-03',
        desc: {
          es: 'Inicié mi carrera profesional participando en el análisis, desarrollo e implementación de soluciones tecnológicas para el sector bancario, adquiriendo una sólida base en desarrollo de software y procesos empresariales.',
          en: 'I started my professional career taking part in the analysis, development and implementation of technology solutions for the banking sector, gaining a solid foundation in software development and business processes.',
        },
      },
    ],
  },
};

export const projects = [
  {
    icon: '🤖', title: { es: 'Agente reemplazo de Moderadores externos', en: 'External Moderators Replacement Agent' },
    desc: {
      es: 'Diseñé e implementé una solución basada en Inteligencia Artificial que analizaba la asignación de moderadores externos e identificaba oportunidades para sustituirlos por personal interno capacitado. El sistema generaba recomendaciones automáticas basadas en datos históricos, disponibilidad y necesidades operativas, permitiendo optimizar recursos y reducir significativamente los costos operativos.',
      en: 'I designed and implemented an Artificial Intelligence solution that analyzed the assignment of external moderators and identified opportunities to replace them with trained internal staff. The system generated automatic recommendations based on historical data, availability and operational needs, optimizing resources and significantly reducing operating costs.',
    },
    results: { es: ['Más de USD $800.000 de ahorro anual'], en: ['Over USD $800,000 in annual savings'] },
  },
  {
    icon: '✅', title: { es: 'Dashboard Inteligente de Aprobaciones', en: 'Smart Approvals Dashboard' },
    desc: {
      es: 'Desarrollé una plataforma web corporativa para la gestión de solicitudes de excepción de skilling. La solución incorporó Inteligencia Artificial para analizar cada solicitud y recomendar automáticamente la mejor alternativa de resolución, además de canalizar el requerimiento directamente al aprobador correspondiente, eliminando pasos manuales y acelerando el proceso de atención.',
      en: 'I built a corporate web platform to manage skilling exception requests. The solution used Artificial Intelligence to analyze each request and automatically recommend the best resolution, and routed it directly to the right approver, eliminating manual steps and speeding up the process.',
    },
    results: { es: ['Más de 20 horas mensuales ahorradas para gerentes y líderes'], en: ['Over 20 hours per month saved for managers and leaders'] },
  },
  {
    icon: '📊', title: { es: 'Dashboard Ejecutivo', en: 'Executive Dashboard' },
    desc: {
      es: 'Diseñé y desarrollé dashboards ejecutivos en Power BI para equipos de liderazgo, consolidando indicadores clave de negocio en una única plataforma interactiva. La solución permitió acceder en tiempo real a métricas críticas para la toma de decisiones y transformó la forma en que se realizaban las presentaciones ejecutivas mensuales.',
      en: 'I designed and built executive dashboards in Power BI for leadership teams, consolidating key business indicators into a single interactive platform. The solution provided real-time access to critical decision-making metrics and transformed how monthly executive presentations were done.',
    },
    results: { es: ['Información en tiempo real para liderazgo ejecutivo', 'Eliminación de procesos manuales de consolidación de datos'], en: ['Real-time information for executive leadership', 'Elimination of manual data consolidation processes'] },
  },
  {
    icon: '📈', title: { es: 'Monthly Business Review Digital', en: 'Digital Monthly Business Review' },
    desc: {
      es: 'Desarrollé una plataforma web moderna para reemplazar las tradicionales presentaciones de PowerPoint utilizadas durante las reuniones ejecutivas de negocio. La solución permitió presentar indicadores, tendencias y resultados de forma dinámica, interactiva y visualmente atractiva, directamente desde la web.',
      en: 'I built a modern web platform to replace the traditional PowerPoint decks used in executive business meetings. It presents indicators, trends and results dynamically, interactively and visually, straight from the web.',
    },
    results: { es: ['Más de 8 horas mensuales ahorradas en preparación de reportes ejecutivos'], en: ['Over 8 hours per month saved in executive report preparation'] },
  },
  {
    icon: '✨', title: { es: 'Soluciones IA', en: 'AI Solutions' },
    desc: {
      es: 'Diseñé y desarrollé soluciones empresariales basadas en Inteligencia Artificial y servicios de Microsoft Azure para automatizar procesos, optimizar operaciones y mejorar la productividad organizacional. Las aplicaciones integraron análisis de datos, automatización y capacidades de IA generativa para resolver desafíos de negocio reales.',
      en: 'I designed and built enterprise solutions based on Artificial Intelligence and Microsoft Azure services to automate processes, optimize operations and improve organizational productivity. The applications integrated data analysis, automation and generative AI capabilities to solve real business challenges.',
    },
    results: { es: ['Automatización de procesos complejos', 'Mejora de productividad y eficiencia operativa'], en: ['Automation of complex processes', 'Improved productivity and operational efficiency'] },
  },
  {
    icon: '☁️', title: { es: 'Transformación Digital', en: 'Digital Transformation' },
    desc: {
      es: 'Participé en iniciativas de transformación digital para organizaciones de Latinoamérica y Estados Unidos, ayudando a modernizar infraestructuras tecnológicas, adoptar servicios cloud y aprovechar tecnologías emergentes para impulsar innovación, productividad y crecimiento empresarial.',
      en: 'I took part in digital transformation initiatives for organizations in Latin America and the United States, helping modernize technology infrastructure, adopt cloud services and leverage emerging technologies to drive innovation, productivity and business growth.',
    },
    results: { es: ['Modernización tecnológica', 'Adopción de soluciones cloud escalables'], en: ['Technology modernization', 'Adoption of scalable cloud solutions'] },
  },
  {
    icon: '🧠', title: { es: 'Machine Learning', en: 'Machine Learning' },
    desc: {
      es: 'Implementé modelos de Machine Learning orientados al análisis predictivo y la generación de recomendaciones para apoyar la toma de decisiones empresariales. La solución permitió analizar grandes volúmenes de información y generar insights accionables para diferentes áreas del negocio.',
      en: 'I implemented Machine Learning models for predictive analytics and recommendations to support business decision making. The solution analyzed large volumes of information and produced actionable insights for different areas of the business.',
    },
    results: { es: ['Decisiones basadas en datos', 'Mayor eficiencia operativa'], en: ['Data-driven decisions', 'Greater operational efficiency'] },
  },
];

// Certifications deduplicated; dates 'YYYY-MM'.
export const certGroups = [
  {
    id: 'ai', title: { es: 'Microsoft · IA y Datos', en: 'Microsoft · AI & Data' }, open: true,
    items: [
      { name: 'Microsoft Certified: Azure Data Scientist Associate', issuer: 'Microsoft', issued: '2024-03', expires: '2025-03', id: '2091362167CA0320' },
      { name: 'Develop generative AI solutions with Azure OpenAI Service', issuer: 'Microsoft', issued: '2024-02', id: '64E4C5CAA432C99E' },
      { name: 'Create an intelligent document processing solution with Azure AI Document Intelligence', issuer: 'Microsoft', issued: '2024-02', id: 'F213670C046FB417' },
      { name: 'Build a natural language processing solution with Azure AI Language', issuer: 'Microsoft', issued: '2024-02', id: '7A0FBDA40ED8B496' },
      { name: 'Build an Azure AI Vision solution', issuer: 'Microsoft', issued: '2024-02', id: '9B40E0074979ABE4' },
      { name: 'Microsoft SkillUp AI', issuer: 'Microsoft', issued: '2023-11' },
      { name: 'Microsoft Certified: Azure AI Engineer Associate', issuer: 'Microsoft', issued: '2023-08', expires: '2024-08', id: '92622C0143FA1C4' },
      { name: 'Microsoft Certified: Azure AI Fundamentals', issuer: 'Microsoft', issued: '2023-06' },
    ],
  },
  {
    id: 'cloud', title: { es: 'Microsoft · Cloud, DevOps y Desarrollo', en: 'Microsoft · Cloud, DevOps & Development' }, open: true,
    items: [
      { name: 'Deploy containers by using Azure Kubernetes Service', issuer: 'Microsoft', issued: '2024-01', id: 'FAB663D7898D5E4D' },
      { name: 'Microsoft Certified: Azure Solutions Architect Expert', issuer: 'Microsoft', issued: '2022-08', expires: '2023-08' },
      { name: 'Microsoft Certified: DevOps Engineer Expert', issuer: 'Microsoft', issued: '2022-02', expires: '2024-02', id: 'D823D94E93498161' },
      { name: 'Microsoft Certified: Azure Developer Associate', issuer: 'Microsoft', issued: '2021-12', expires: '2022-12' },
      { name: 'Microsoft Certified: Azure Administrator Associate', issuer: 'Microsoft', issued: '2019-11', expires: '2023-11' },
      { name: 'Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft', issued: '2019-02' },
      { name: 'MTA: Software Development Fundamentals', issuer: 'Microsoft', issued: '2018-12' },
    ],
  },
  {
    id: 'recognition', title: { es: 'Reconocimientos Microsoft', en: 'Microsoft recognitions' }, open: false,
    items: [
      { name: 'Microsoft Certified Trainer 2021-2022', issuer: 'Microsoft', issued: '2021-12' },
      { name: 'OpenHack: Serverless Coach', issuer: 'Microsoft OpenHack', issued: '2022-02' },
      { name: 'Accessibility in Action', issuer: 'Microsoft', issued: '2022-01' },
      { name: 'Event Speaker Silver', issuer: 'Microsoft', issued: '2019-02' },
      { name: 'Mentor Gold', issuer: 'Microsoft', issued: '2019-02' },
      { name: 'Insight Selling', issuer: 'Microsoft', issued: '2017-10' },
    ],
  },
  {
    id: 'instructor', title: { es: 'Instructor · Hitos Skillable', en: 'Instructor · Skillable milestones' }, open: false,
    items: [
      { name: 'Instructor Recognition - 1,000 Students Reached', issuer: 'Skillable', issued: '2024-04' },
      { name: 'Instructor Recognition - 50 Classes Delivered', issuer: 'Skillable', issued: '2023-12' },
      { name: 'Instructor Recognition - 750 Students Reached', issuer: 'Skillable', issued: '2023-08' },
      { name: 'Instructor Recognition - 500 Students Reached', issuer: 'Skillable', issued: '2023-01' },
      { name: 'Instructor Recognition - 25 Classes Delivered', issuer: 'Skillable', issued: '2023-01' },
      { name: 'Instructor Recognition - 75 Students Reached', issuer: 'Skillable', issued: '2022-05' },
      { name: 'Instructor Recognition - 25 Students Reached', issuer: 'Skillable', issued: '2022-03' },
      { name: 'Instructor Recognition - First Class Delivered', issuer: 'Skillable', issued: '2022-03' },
    ],
  },
  {
    id: 'other', title: { es: 'Industria, desarrollo y habilidades blandas', en: 'Industry, development & soft skills' }, open: false,
    items: [
      { name: 'Primerli - Manufacturing Foundations', issuer: 'Primerli', issued: '2026-09' },
      { name: 'Primerli - Chemicals Industry Foundations', issuer: 'Primerli', issued: '2026-09' },
      { name: 'Primerli - Discrete Manufacturing Industry Foundations', issuer: 'Primerli', issued: '2026-08' },
      { name: 'Psychological Safety: Clear Blocks to Innovation, Collaboration, and Risk-Taking', issuer: 'LinkedIn', issued: '2025-08' },
      { name: 'ASP.NET Core Web API Guide', issuer: "O'Reilly", issued: '2024-01' },
      { name: 'ASP.NET Core MVC', issuer: "O'Reilly", issued: '2024-01' },
      { name: 'Creating Inclusive Learning Experiences', issuer: 'LinkedIn', issued: '2022-10' },
      { name: 'Improving Your Listening Skills', issuer: 'LinkedIn', issued: '2019-05' },
    ],
  },
];

export const education = [
  {
    school: 'Universidad Santa María',
    degree: { es: 'Ingeniería, Sistemas', en: 'Engineering, Systems' },
    years: '1998 – 2004',
  },
  {
    school: 'Universidad Central de Venezuela',
    degree: { es: 'Locutor de Radio y Televisión (Broadcasting)', en: 'Radio & Television Announcer / Talking Head (Broadcasting)' },
    years: '2010',
  },
];

export const languages = [
  { name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo o bilingüe', en: 'Native or bilingual' }, pct: 100 },
  { name: { es: 'Inglés', en: 'English' }, level: { es: 'Intermedio alto', en: 'High intermediate' }, pct: 75 },
];

export const contact = {
  linkedin: 'https://www.linkedin.com/in/restrian',
  email: 'renatostrianese@hotmail.com',
};
