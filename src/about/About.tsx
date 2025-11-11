import React, { useState } from "react";

const abstracts = {
  mastersCapstone: `
Ranging from presidential elections, to social media likes, voting
generally involves putting forward an opinion about an item, such
as a person, idea or product. Therefore, voters are generally
motivated to remain anonymous or avoid voting entirely, especially
when voting requires effort or is on a sensitive issue. As such,
datasets of votes are often sparse and include minimal explicit
information about the voters or items. However, much of this
information can still exist implicitly within the vote values
themselves, because votes are usually correlated to features of
both the voters and items. I have identified and developed a
denoising autoencoder neural network model that can be trained
on a sparse dataset of votes to automatically classify voters and
items into latent classes and then predict missing votes using these
classifications. The autoencoder classifies voters or items completely
unsupervised by using a softmax activation function at the code layer,
as well as regularising terms in the training loss function that minimise
the code entropy. Using votes made in the U.S. House of Representatives
from 1990 to May 2020 as an example, the model correctly predicted
missing votes with 92.6% accuracy. Furthermore, some of the learnt latent
classes corresponded to interpretable categories, such as party
affiliation, which could be identified with a 99.5% accuracy.`,
};

const PopUpAbstract: React.FC<{
  abstract: string;
  children: React.ReactNode;
}> = ({ abstract, children }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <span
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
    >
      <span
        style={{ color: "rgb(76, 192, 212)" }}
        className="hover:cursor-pointer"
      >
        {children}
      </span>
      <div
        style={{ width: "50vw" }}
        className={`absolute bg-slate-700 shadow-lg p-2 rounded-lg text-xs  ${
          showPopup ? "block" : "hidden"
        }`}
      >
        <span className="font-bold">Abstract: </span>
        {abstract}
      </div>
    </span>
  );
};

const CVTimeSection: React.FC<{
  leftBar: string[];
  title: string;
  children?: React.ReactNode;
}> = ({ leftBar, title, children }) => {
  return (
    <>
      <div className=" text-right flex flex-col items-end text-slate-300 italic text-xs pt-1 max-w-56">
        {leftBar.map((item, index) => (
          <div key={index} className="pr-1 mb-1">
            {item}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="text-sm text-slate-300">{children}</div>
      </div>
    </>
  );
};

const name = "Lachlan Gibson";
const title = "Lachlan Gibson - About";
const description =
  "Lachlan Gibson is a data scientist and developer with experience in AI, algorithmic design, scientific computing, and data analytics.";
const imageUrl =
  "https://www.lachlangibson.dev/images/home/lachlan_gibson.webp";
const pageUrl = "https://www.lachlangibson.dev/about/";
const keyWords = `Lachlan Gibson, data scientist, developer, AI, simulation, 
machine learning, deep learning, reinforcement learning, dimensionality reduction, 
algorithmic design, neural network architecture, Q-Learning, dynamic programming, 
numerical methods, scientific computing, MATLAB, finite element method, 
finite difference method, discrete event simulation, data analytics, 
Python, R, SQL, PyTorch, pandas, Matplotlib, physics, mathematics, statistics`;

const About: React.FC = () => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="author" content={name} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content={keyWords} />
      <h1 className="text-3xl font-bold text-center tracking-wider py-3">
        Academic History
      </h1>
      <div className="grid md:grid-cols-[auto,1fr] grid-cols-[2fr,7fr]  gap-2 md:gap-4">
        <h2 className="py-3 col-span-2 border-t font-bold text-xl tracking-wider text-center">
          Employment
        </h2>
        <CVTimeSection
          leftBar={[
            "Gilmour Space Technologies",
            "Software Services",
            "2024 \u2014 present",
          ]}
          title="Software Engineer"
        >
          I develop scalable software systems for launch vehicles and
          satellites, including full-stack web applications supporting
          mechanical design and production. I use Golang, Vue.js, and modern
          DevOps practices such as CI/CD and infrastructure automation, and have
          worked on simulation software requiring strong programming and
          mathematical skills to meet regulatory and stakeholder needs.
        </CVTimeSection>
        <CVTimeSection
          leftBar={[
            "The University of Queensland",
            "CARM, ACEMS",
            "2020 \u2014 2022",
          ]}
          title="Postdoctoral Research Fellow"
        >
          From August 2020 to June 2021, I served as a Postdoctoral Research
          Fellow with the Centre for Applications in Natural Resource
          Mathematics, and then with the ARC Centre of Excellence for
          Mathematical & Statistical Frontiers. Some of my research included{" "}
          <a
            href="https://era.daf.qld.gov.au/id/eprint/8190/"
            target="_blank"
            rel="noopener noreferrer"
          >
            investigating environmental impacts on fishery risk
          </a>
          , exploring{" "}
          <a
            href="https://doi.org/10.1007/978-3-030-92511-6_10"
            target="_blank"
            rel="noopener noreferrer"
          >
            reinforcement learning methods for managing restless multi-armed
            bandits
          </a>{" "}
          and developing new methods for{" "}
          <a
            href="https://doi.org/10.48550/arXiv.2305.07863"
            target="_blank"
            rel="noopener noreferrer"
          >
            rare-event simulation via generative neural networks
          </a>
          . I also supervised a Master of Data Science student's capstone
          industry project during this time.
        </CVTimeSection>
        <CVTimeSection
          leftBar={["The University of Queensland", "SMP", "2016 \u2014 2020"]}
          title="Mathematics and Physics Tutor"
        >
          I tutored several mathematics, physics and data science courses during
          my postgraduate studies. This included teaching tutorial, practical
          and contact classes, preparing lessons, working with other tutors and
          marking assessments. Some subjects included: calculus, linear algebra,
          ordinary differential equations, electromagnetism, and statistical
          methods for data science.
        </CVTimeSection>
        <h2 className="py-3 col-span-2 border-t font-bold text-xl tracking-wider text-center">
          Education
        </h2>
        <CVTimeSection
          leftBar={[
            "The University of Queensland",
            "School of ITEE",
            "2019 \u2014 2020",
          ]}
          title="Master of Data Science"
        >
          With a GPA of 6.82/7.00, I studied a range of theoretical and
          practical content including deep learning, data mining, database
          systems and operations research. In my capstone project titled,{" "}
          <PopUpAbstract abstract={abstracts["mastersCapstone"]}>
            <span className="italic">
              Categorical Vector Clustering: Revealing hidden features of votes
              and voters
            </span>
          </PopUpAbstract>
          , I developed a recommender-system-like model based on a denoising
          autoencoder to classify voters and items into latent classes and
          predict missing votes using these classifications.
        </CVTimeSection>
        <CVTimeSection
          leftBar={["The University of Queensland", "OMG", "2016 \u2014 2019"]}
          title="Doctor of Philosophy (Physics)"
        >
          As a member of the Optical-tweezers Micromanipulation Group, I
          completed my thesis under the supervision of Halina
          Rubinsztein-Dunlop, Timo Nieminen, and Alexander Stilgoe. The thesis,
          titled "
          <a
            href="https://doi.org/10.14264/uql.2019.644"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hydrodynamic forces in optical tweezers
          </a>
          ", focused on the mathematical and computational modeling of fluid
          dynamics in optical tweezers systems. This included developing{" "}
          <a
            href="https://doi.org/10.1103/PhysRevE.95.042608"
            target="_blank"
            rel="noopener noreferrer"
          >
            new theories that facilitated record-breaking experiments
          </a>{" "}
          and applying{" "}
          <a
            href="https://doi.org/10.1103/PhysRevE.99.043304"
            target="_blank"
            rel="noopener noreferrer"
          >
            machine learning techniques to streamline the computation of complex
            fluid dynamics
          </a>
          . During my candidature, in addition to coauthoring several{" "}
          <a
            href="https://scholar.google.com/citations?user=NeEMSU0AAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            publications
          </a>
          , I also presented my research at multiple international conferences,
          including APPC-AIO Congress 2016 and AIP 2018.
        </CVTimeSection>
        <CVTimeSection
          leftBar={["The University of Queensland", "SMP", "2011 \u2014 2015"]}
          title="Bachelor of Science (Honours)/ Bachelor of Arts"
        >
          I pursued a dual Bachelor of Science and Bachelor of Arts degree,
          majoring in Mathematics and Physics. During the initial phase
          (2011-2014), I achieved a GPA of 6.66/7.00. In 2015, I completed an
          honours year in Physics, earning first class honours with a GPA of
          6.75/7.00. As a participant in the Advanced Study Program in Science
          (ASPinS) and the UQ Summer Research Scholarship Programs for three
          consecutive years, I actively engaged in research throughout my
          undergraduate studies. This research was presented at various
          conferences, including the UQ ASPinS Undergraduate Research
          Conferences (2011-2013) and the UQ Undergraduate Research Conferences
          (2012-2013), where I won the best poster award in 2012. In 2015, I
          interned at The Simulation Group, where I contributed to the AnyLogic
          simulation of Brisbane's proposed Bus and Train tunnel. Throughout my
          studies, my academic achievements were recognised with multiple Dean's
          Commendations for High Achievement/Academic Excellence.
        </CVTimeSection>
      </div>
    </>
  );
};

export default About;
