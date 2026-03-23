import React from "react";
import { Link } from "react-router";
import IconLinks from "../navigation/IconLinks";

const careerArc = [
  {
    phase: "Technical Foundations",
    years: "2011 - 2019",
    description: "Physics and mathematics shaped how I reason about models, uncertainty, and complex systems.",
  },
  {
    phase: "Machine Learning and Data Science",
    years: "2019 - 2020",
    description: "That foundation extended into applied machine learning, optimization, and predictive modelling.",
  },
  {
    phase: "Postdoctoral Research",
    years: "2020 - 2022",
    description: "Applied research across simulation, environmental forecasting, and artificial intelligence.",
  },
  {
    phase: "Engineering Systems",
    years: "2024 - Present",
    description: "Simulation tools and production software for engineering systems.",
  },
];

const backgroundEntries = [
  {
    title: "Software Engineer",
    organisation: "Gilmour Space Technologies, Software Services",
    years: "2024 - Present",
    body: "I develop scalable software systems for launch vehicles and satellites, including full-stack web applications that support mechanical design and production.",
    bullets: [
      "Backend and frontend development",
      "CI/CD and infrastructure automation",
      "Simulation-oriented work with substantial mathematical and programming demands",
    ],
  },
  {
    title: "Postdoctoral Research Fellow",
    organisation: "The University of Queensland, CARM and ACEMS",
    years: "2020 - 2022",
    body: "I worked across environmental modelling, simulation, and control optimization, contributing research that connected probability, learning, and computational methods.",
    bullets: [
      "Environmental forecasting and fishery risk",
      "Restless multi-armed bandits and index learning",
      "Rare-event simulation using generative neural networks",
    ],
    links: [
      {
        href: "https://era.daf.qld.gov.au/id/eprint/8190/",
        label: "Fishery risk research",
      },
      {
        href: "https://doi.org/10.1007/978-3-030-92511-6_10",
        label: "Reinforcement learning and bandits",
      },
      {
        href: "https://doi.org/10.48550/arXiv.2305.07863",
        label: "Rare-event simulation",
      },
    ],
  },
  {
    title: "Master of Data Science",
    organisation: "The University of Queensland, School of ITEE",
    years: "2019 - 2020",
    body: "I graduated with a GPA of 6.82/7.00, studying deep learning, data mining, database systems, and operations research.",
    detailTitle: "Capstone project",
    detail:
      "Categorical Vector Clustering: Revealing hidden features of votes and voters. I developed a denoising autoencoder that classified voters and items into latent classes and predicted missing votes from sparse data. On U.S. House of Representatives votes from 1990 to May 2020, the model achieved 92.6% accuracy.",
  },
  {
    title: "Mathematics and Physics Tutor",
    organisation: "The University of Queensland, SMP",
    years: "2016 - 2020",
    body: "I taught mathematics, physics, and data science courses during my postgraduate studies.",
    bullets: [
      "Tutorial, practical, and contact teaching",
      "Assessment marking and lesson preparation",
      "Subjects including calculus, linear algebra, electromagnetism, and statistics",
    ],
  },
  {
    title: "Doctor of Philosophy (Physics)",
    organisation: "The University of Queensland, OMG",
    years: "2016 - 2019",
    body: "My thesis, Hydrodynamic forces in optical tweezers, focused on mathematical and computational modelling of fluid dynamics in optical tweezers systems.",
    links: [
      {
        href: "https://doi.org/10.14264/uql.2019.644",
        label: "Thesis",
      },
      {
        href: "https://doi.org/10.1103/PhysRevE.95.042608",
        label: "Record-breaking experiment theory",
      },
      {
        href: "https://doi.org/10.1103/PhysRevE.99.043304",
        label: "Machine learning for fluid dynamics",
      },
      {
        href: "https://scholar.google.com/citations?user=NeEMSU0AAAAJ&hl=en",
        label: "Publication list",
      },
    ],
  },
  {
    title: "Bachelor of Science (Honours) / Bachelor of Arts",
    organisation: "The University of Queensland, SMP",
    years: "2011 - 2015",
    body: "I majored in mathematics and physics, completed first class honours in Physics, and was involved in research throughout much of my undergraduate degree.",
    detailTitle: "Highlights",
    detail:
      "This included the Advanced Study Program in Science, three UQ Summer Research Scholarship projects, multiple research presentations, a best poster award in 2012, and an internship contributing to transport simulation work at The Simulation Group.",
  },
];

const SectionHeading: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
}> = ({ eyebrow, title, description }) => (
  <div className="max-w-3xl">
    {eyebrow ? (
      <p className="text-xs font-semibold tracking-[0.24em] text-(--site-link)/90 uppercase">{eyebrow}</p>
    ) : null}
    <h2 className="mt-2 text-3xl leading-tight font-semibold tracking-tight text-(--site-text) md:text-4xl">{title}</h2>
    {description ? <p className="mt-4 text-base text-(--site-text-muted) md:text-lg">{description}</p> : null}
  </div>
);

const LinkPillList: React.FC<{
  links: { href: string; label: string }[];
}> = ({ links }) => (
  <div className="mt-4 flex flex-wrap gap-2">
    {links.map((link) => (
      <a
        key={link.href}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-(--site-border) bg-(--site-surface-alt)/25 px-3 py-1.5 text-sm text-(--site-text)"
      >
        {link.label}
      </a>
    ))}
  </div>
);

const DisclosureCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <details className="mt-4 border border-(--site-border) bg-(--site-surface-alt)/20 p-4 open:bg-(--site-surface-alt)/35">
    <summary className="list-none text-sm font-semibold text-(--site-link)">{title}</summary>
    <div className="mt-3 text-sm leading-6 text-(--site-text-muted)">{children}</div>
  </details>
);

const TimelineCard: React.FC<{
  title: string;
  organisation: string;
  years: string;
  body: string;
  bullets?: string[];
  links?: { href: string; label: string }[];
  detailTitle?: string;
  detail?: string;
}> = ({ title, organisation, years, body, bullets, links, detailTitle, detail }) => (
  <article className="relative border border-(--site-border) bg-(--site-surface) p-6">
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <span className="border border-(--site-border) bg-(--site-surface-alt)/30 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-(--site-text-muted) uppercase">
        {years}
      </span>
      <span className="text-sm text-(--site-text-muted)">{organisation}</span>
    </div>
    <h3 className="text-2xl font-semibold tracking-tight text-(--site-text)">{title}</h3>
    <p className="mt-3 text-left text-(--site-text)">{body}</p>
    {bullets?.length ? (
      <ul className="mt-4 space-y-2 text-sm leading-6 text-(--site-text-muted)">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--site-link)" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    ) : null}
    {detail && detailTitle ? <DisclosureCard title={detailTitle}>{detail}</DisclosureCard> : null}
    {links ? <LinkPillList links={links} /> : null}
  </article>
);

const About: React.FC = () => {
  return (
    <div className="space-y-16 pb-12 pt-4 md:space-y-24 md:pb-16">
      <section className="relative overflow-hidden border border-(--site-border) bg-(--site-surface) px-6 py-8 sm:px-8 md:px-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--site-link)/60 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[32px_32px]" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,22rem)] lg:items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.28em] text-(--site-link) uppercase">About</p>
            <h1 className="mt-4 max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-(--site-text) md:text-6xl">
              Technical work with theoretical depth.
            </h1>
            <p className="mt-5 max-w-3xl text-left text-lg leading-8 text-(--site-text-muted)">
              My background spans physics, machine learning, applied research, simulation, and engineering systems,
              moving from academia into industry.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/articles/"
                className="border border-(--site-link) bg-(--site-link) px-5 py-2.5 text-sm font-semibold text-[#0f2030] no-underline hover:no-underline"
              >
                View portfolio
              </Link>
              <IconLinks className="m-0 flex h-5 w-auto gap-3 border-l border-(--site-border) pl-4" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-(--site-text-muted)">
              <span>Currently: Software Engineer at Gilmour Space</span>
              <span>Focus: engineering systems, simulation, artificial intelligence</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="border border-(--site-border) bg-(--site-bg)/20 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] text-(--site-link) uppercase">Career Arc</p>
              <div className="mt-5 space-y-4">
                {careerArc.map((stage, index) => (
                  <article key={stage.phase} className="border-l border-(--site-border) pl-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-base font-semibold text-(--site-text)">{stage.phase}</h2>
                      <span className="text-xs tracking-[0.18em] text-(--site-text-muted) uppercase">0{index + 1}</span>
                    </div>
                    <p className="mt-1 text-xs tracking-[0.18em] text-(--site-text-muted) uppercase">{stage.years}</p>
                    <p className="mt-2 text-left text-sm leading-6 text-(--site-text-muted)">{stage.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading eyebrow="Background" title="Work and education" />

        <div className="relative space-y-6 before:absolute before:top-0 before:bottom-0 before:left-4 before:hidden before:w-px before:bg-(--site-border) md:before:block md:pl-10">
          {backgroundEntries.map((entry) => (
            <div key={entry.title} className="relative">
              <div className="absolute top-10 left-[-2.15rem] hidden h-3 w-3 rounded-full border-2 border-(--site-bg) bg-(--site-link) md:block" />
              <TimelineCard {...entry} />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-b border-(--site-border) px-6 py-8 sm:px-8 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-(--site-link) uppercase">Next</p>
            <h2 className="mt-2 text-3xl leading-tight font-semibold tracking-tight text-(--site-text) md:text-4xl">
              Explore the portfolio or read the technical work in more detail.
            </h2>
            <p className="mt-4 text-base text-(--site-text-muted)">
              The rest of the site covers the projects, research, and writing behind this profile.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/articles/"
              className="border border-(--site-link) bg-(--site-link) px-5 py-2.5 text-sm font-semibold text-[#0f2030] no-underline hover:no-underline"
            >
              Go to portfolio
            </Link>
            <Link
              to="/"
              className="border border-(--site-border) bg-(--site-bg)/20 px-5 py-2.5 text-sm font-semibold text-(--site-text) no-underline"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
