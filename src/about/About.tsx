import React from "react";
import { Helmet } from "react-helmet";

const About: React.FC<{}> = () => {
  return (
    <>
      <Helmet>
        <title>Lachlan Gibson - About</title>
      </Helmet>
      <section>
        <h1 className="text-xl font-bold mb-3">
          ChatGPT's Introduction to Lachlan
        </h1>
        <p>
          Dr. Lachlan Gibson, an Australian citizen, is a scholar and researcher
          in the field of Physics and Data Science. He began his educational
          journey at the University of Queensland, where he pursued a dual
          program of a Bachelor of Science and a Bachelor of Arts from 2011 to
          2014 with extended majors in Physics and Mathematics respectively.
          During his undergraduate years, Dr. Gibson was heavily involved in
          research programs, including the Advanced Study Program in Science
          (ASPinS), and was recognized by the UQ Summer Research Scholarship
          Program for three consecutive years.
          <br />
          <br />
          His desire for continuous learning led him to attain his Bachelor of
          Science (Honours) in 2015, achieving First Class Honours. His
          dedication was evident through his participation in a Simulation Group
          Internship, where he worked on simulations of the proposed Brisbane
          BaT tunnel.
          <br />
          <br />
          Dr. Gibson further expanded his knowledge base by pursuing a Doctor of
          Philosophy (Physics) from 2016 to 2019. His thesis focused on the
          mathematical and computational modelling of fluid dynamics relevant to
          optical-tweezers systems. He then added to his expertise by completing
          a Masters of Data Science in 2020 with a capstone study project on
          Categorical Vector Clustering.
          <br />
          <br />
          Following his academic pursuits, Dr. Gibson embarked on a career as a
          Postdoctoral Research Fellow at the University of Queensland from
          August 2020 to December 2022. His work involved researching rare-event
          simulation via generative neural networks, environmental effects on
          fishery risk, and reinforcement learning methods for controlling
          restless multi-armed bandits. He also served as an Academic Tutor from
          2016 to 2020 for various Mathematics and Physics courses.
          <br />
          <br />
          Besides his professional accomplishments, Dr. Gibson has shown a
          commendable spirit of volunteerism. He has taken on roles such as
          Assistant Secretary and Sound Technician at Salisbury Baptist Church
          between 2013 and 2022, providing administrative and technical support
          for the organization. He has also volunteered as a Youth Leader,
          mentoring high school students from the church and local community.
          Additionally, he contributed to Scripture Union as a camp leader, and
          as an English Conversation Club Volunteer Helper at UQ's Institute of
          Continuing & TESOL Education.
          <br />
          <br />
          With his impressive educational qualifications, extensive research
          experience, and a strong commitment to service, Dr. Lachlan Gibson
          stands as an accomplished researcher and data scientist, dedicated to
          advancing knowledge and improving the community.
          <br />
        </p>
      </section>
    </>
  );
};

export default About;
