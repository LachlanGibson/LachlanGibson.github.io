import React, { useState } from "react";
import { Helmet } from "react-helmet";

interface PopupProps {
  text: string;
  isVisible: boolean;
}

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
  institution: string;
  title: string;
  dates: string;
  children?: React.ReactNode;
}> = ({ institution, dates, title, children }) => {
  return (
    <>
      <div className="flex flex-col items-end text-slate-300 italic">
        <div className="pr-1">{institution}</div>
        <div className="pr-1">{dates}</div>
      </div>
      <div className="flex flex-col items-start">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="text-sm text-slate-400">{children}</div>
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
      <div className="grid grid-cols-[auto,1fr] gap-4">
        <h2 className="py-3 col-span-2 border-t font-bold text-xl tracking-wider text-center">
          Employment
        </h2>
        <CVTimeSection
          institution={`The University of Queensland`}
          dates="2020 &mdash; Present"
          title="Postdoctoral Research Fellow"
        ></CVTimeSection>
        <h2 className="py-3 col-span-2 border-t font-bold text-xl tracking-wider text-center">
          Education
        </h2>
        <CVTimeSection
          institution="The University of Queensland"
          dates="2019 &mdash; 2020"
          title="Master of Data Science"
        >
          With a GPA of 6.82/7.00, I studied a range of theoretical and
          practical content including deep learning, data mining, database
          systems and operations research. In my capstone project titled,{" "}
          <PopUpAbstract
            abstract={`
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
            affiliation, which could be identified with a 99.5% accuracy.`}
          >
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
          institution="The University of Queensland"
          dates="2016 &mdash; 2019"
          title="Doctor of Philosophy (Physics)"
        ></CVTimeSection>
        <CVTimeSection
          institution="The University of Queensland"
          dates="2011 &mdash; 2015"
          title="Bachelor of Science (Honours)/ Bachelor of Arts"
        ></CVTimeSection>
      </div>
    </>
  );
};

export default About;
