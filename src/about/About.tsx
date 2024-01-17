import React, { useState } from "react";
import { Helmet } from "react-helmet";

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
      <span className="hover:cursor-pointer text-sky-400">{children}</span>
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

const About: React.FC<{}> = () => {
  return (
    <>
      <Helmet>
        <title>Lachlan Gibson - About</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center tracking-wider py-3">
        Academic History
      </h1>
      <div className="grid md:grid-cols-[auto,1fr] grid-cols-[1fr,3fr]  gap-2 md:gap-4">
        <h2 className="py-3 col-span-2 border-t font-bold text-xl tracking-wider text-center">
          Employment
        </h2>
        <CVTimeSection
          leftBar={[
            "The University of Queensland",
            "ARC Centre of Excellence for Mathematical & Statistical Frontiers",
            "2021 \u2014 2022",
          ]}
          title="Postdoctoral Research Fellow"
        ></CVTimeSection>
        <CVTimeSection
          leftBar={[
            "The University of Queensland",
            "Centre for Applications in Natural Resource Mathematics",
            "2020 \u2014 2021",
          ]}
          title="Postdoctoral Research Fellow"
        ></CVTimeSection>
        <CVTimeSection
          leftBar={[
            "The University of Queensland",
            "School of Mathematics & Physics",
            "2016 \u2014 2020",
          ]}
          title="Mathematics and Physics Tutor"
        >
          I tutored mathematics, physics and data science courses during my
          postgraduate studies. This included teaching tutorial, practical and
          contact classes, preparing lessons, working with other tutors and
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
            "School of Information Technology & Electrical Engineering",
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
          leftBar={[
            "The University of Queensland",
            "Optical Micro-manipulation Group",
            "2016 \u2014 2019",
          ]}
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
          .
        </CVTimeSection>
        <CVTimeSection
          leftBar={[
            "The University of Queensland",
            "School of Mathematics & Physics",
            "2011 \u2014 2015",
          ]}
          title="Bachelor of Science (Honours)/ Bachelor of Arts"
        ></CVTimeSection>
      </div>
    </>
  );
};

export default About;
