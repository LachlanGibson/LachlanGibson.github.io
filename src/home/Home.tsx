import React from "react";
import IconLinks from "../navigation/IconLinks";
import ProjectSection from "./ProjectSection";
import LinkList from "./LinkList";

const SkillCard: React.FC<{ title: string; items: string[] }> = ({
  title,
  items,
}) => {
  return (
    <div className="flex flex-col items-start">
      <h3 className="text-base">{title}</h3>
      <ul className="flex flex-col items-start list-outside list-none m-0 text-slate-400 text-left text-xs">
        {items.map((item, i) => (
          <li key={i}>- {item}</li>
        ))}
      </ul>
    </div>
  );
};

const name = "Lachlan Gibson";
const title = "Lachlan Gibson";
const description =
  "Lachlan Gibson is a data scientist and developer with experience in AI, algorithmic design, scientific computing, and data analytics.";
const imageUrl =
  "https://www.lachlangibson.dev/images/home/lachlan_gibson.webp";
const pageUrl = "https://www.lachlangibson.dev/";
const keyWords = `Lachlan Gibson, data scientist, developer, AI, simulation, 
machine learning, deep learning, reinforcement learning, dimensionality reduction, 
algorithmic design, neural network architecture, Q-Learning, dynamic programming, 
numerical methods, scientific computing, MATLAB, finite element method, 
finite difference method, discrete event simulation, data analytics, 
Python, R, SQL, PyTorch, pandas, Matplotlib, physics, mathematics, statistics`;

const Home: React.FC<{}> = () => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta property="og:title" content={name} />
      <meta name="twitter:title" content={name} />
      <meta name="author" content={name} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content={keyWords} />

      <div className=" w-full flex flex-col items-center">
        <div className="max-w-48 max-h-48 w-full aspect-square bg-slate-200 overflow-hidden rounded-full relative border-sky-600 border-solid border-2">
          <img
            className="h-full"
            src="/images/home/lachlan_gibson_600.webp"
            alt="Lachlan Gibson"
          />
        </div>
        <div
          className="my-1 font-bold tracking-wider"
          style={{ fontSize: "1.8rem", lineHeight: "2.25rem" }}
        >
          Lachlan Gibson
        </div>
        <p className="text-sky-700 max-w-48 w-full text-center text-md leading-[0.9rem]">
          Data scientist & Developer
          <br />
          AI & Simulation
        </p>
        <IconLinks />
        <div className="md2:pl-4 mt-4 w-full gap-4 grid grid-cols-2 md2:grid-cols-4 md2:max-w-3xl max-w-sm">
          <SkillCard
            title="Artificial Intelligence"
            items={[
              "Machine learning",
              "Deep learning",
              "Reinforcement learning",
              "Dimensionality reduction",
            ]}
          />
          <SkillCard
            title="Algorithmic Design"
            items={[
              "Neural network architecture",
              "Q-Learning",
              "Dynamic programming",
              "Numerical methods",
            ]}
          />
          <SkillCard
            title="Scientific Computing"
            items={[
              "MATLAB",
              "Finite element method",
              "Finite difference method",
              "Discrete event simulation",
            ]}
          />
          <SkillCard
            title="Data Analytics"
            items={["Python, R, SQL", "PyTorch", "pandas", "Matplotlib"]}
          />
        </div>
        <h2 className="text-center text-3xl tracking-widest mt-10 pt-8 w-full">
          Sample Projects
        </h2>
        <div className="flex flex-col w-full mt-4">
          <ProjectSection title="Rare-Event Simulation via Generative Models">
            <div className="flex w-full gap-4">
              <p>
                During my time with ACEMS I worked with other researchers on
                developing deep learning analogues to the{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Cross-entropy_method"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cross-entropy method
                </a>{" "}
                for rare-event simulation. Our goal was to build a neural
                network framework for the simulation of independent random
                variables that could mimic arbitrary distributions, especially
                ones conditioned on rare events. The initial framework we
                developed included two neural networks that were trained
                simultaneously using a target function. One was a generative
                model and the other estimated the probability density function
                of the first. We later refined the framework to use a single{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Flow-based_generative_model"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Normalizing Flow generative model
                </a>
                , which could, in principle, approximate any sampling
                distribution arbitrarily well. The figures below show the model
                learning to approximate the target distribution of a truncated
                normal distribution.
              </p>
            </div>
            <LinkList
              links={[
                [
                  "https://doi.org/10.48550/arXiv.2305.07863",
                  "2023 - Normalizing Flows arXiv preprint",
                ],
                [
                  "https://doi.org/10.1007/978-3-031-10193-9_8",
                  "2022 - Springer book chapter",
                ],
              ]}
            />
            <div className="grid sm:gap-4 gap-2 justify-center sm:grid-cols-4 grid-cols-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <img
                  className="w-full aspect-square"
                  src={`/images/home/projects/normalising_flows${i}.svg`}
                  alt={`Normalizing Flows ${i}`}
                  key={i}
                />
              ))}
            </div>
          </ProjectSection>
          <ProjectSection title="Control Optimisation with Q-Learning and the Whittle Index">
            <p>
              During my time as a postdoctoral research fellow at UQ I worked
              with Peter Jacko and Yoni Nazarathy to develop a method built on
              an understanding of both the Whittle index and Q-learning for
              learning index rules for multi-armed bandits, restless bandits,
              and dynamic resource allocation. Our approach seemed to be able to
              deliver similar or better performance than other state-of-the-art
              methods but was potentially applicable to a much broader and more
              general set of problems. Below is a recording of a presentation I
              gave at the EAI VALUETOOLS 2021 conference.
            </p>
            <LinkList
              links={[
                [
                  "https://doi.org/10.1007/978-3-030-92511-6_10",
                  "2021 - Conference paper",
                ],
                [
                  "https://youtu.be/XoKw-bsBH98?si=AWUncfWXFox8pGCO&t=9",
                  "2021 - Conference presentation",
                ],
              ]}
            />
            <iframe
              className="w-full aspect-video max-w-lg mx-auto mt-4"
              src={
                "https://www.youtube.com/embed/XoKw-bsBH98?si=wfTz9eYaTs4GgZsL&amp;start=9"
              }
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={true}
            />
          </ProjectSection>
          <ProjectSection title="Modelling and Forecasting Environmental Changes">
            <p>
              During my time with CARM we worked on a project to model
              environmental changes and effects on wild-caught species in
              Queensland. My main contribution was to model and forecast
              variables that had been correlated to the abundance of wild-caught
              species like sea surface temperatures. Below is an example where I
              modelled and forecasted sea level changes in a specific Queensland
              region using a combined linear and trigonometric model with
              autoregressive residuals. It predicts a trend of about 2.8cm sea
              level rise per decade.
            </p>
            <LinkList
              links={[
                [
                  "https://www.frdc.com.au/project/2019-013",
                  "2021 - FRDC Report",
                ],
              ]}
            />
            <img
              className="w-full mx-auto max-w-2xl"
              src="/images/home/projects/GSLA_R2.svg"
              alt="Sea level forecast"
            />
          </ProjectSection>
          <ProjectSection title="Categorical Vector Clustering using Denoising Autoencoders">
            <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
              <div className="my-4">
                <p>
                  For my Master of Data Science capstone project in 2020 I
                  developed a denoising autoencoder neural network model that
                  could be trained on sparse datasets of votes to automatically
                  classify voters and items into latent classes and then predict
                  missing votes using these classifications. The autoencoder
                  classifies voters or items completely unsupervised. The model
                  correctly predicted missing votes made in the U.S. House of
                  Representatives from 1990 to May 2020 with 92.6% accuracy.
                  Furthermore, some of the learnt latent classes corresponded to
                  interpretable categories, such as party affiliation, which
                  could be identified with a 99.5% accuracy.
                </p>
              </div>
              <img
                className="w-full mx-auto max-w-lg"
                src="/images/home/projects/vote_model_robustness.svg"
                alt="Sea level forecast"
              />
            </div>
          </ProjectSection>
          <ProjectSection title="Optical Tweezers Microrheology">
            <div className="flex w-full gap-4">
              <div className="my-4 w-full">
                <p>
                  Light carries momentum, and when a laser is tightly focused
                  under a microscope, it can exert forces on microscopic
                  objects. This is the principle behind optical tweezers, a
                  powerful tool for manipulating very small particles. During my
                  undergraduate and PhD studies I worked with the Optical
                  Micro-manipulation Group at The University of Queensland to
                  research and develop novel techniques to apply optical
                  tweezers to the field of microrheology, measuring viscoelastic
                  properties of fluids in very small volumes by tracking the
                  motion of trapped particles.
                </p>
                <LinkList
                  links={[
                    [
                      "https://doi.org/10.1103/PhysRevE.95.042608",
                      "2017 - Physical Review E article",
                    ],
                    [
                      "https://doi.org/10.1364/OPTICA.4.001103",
                      "2017 - Optica article",
                    ],
                    [
                      "https://doi.org/10.1038/srep01759",
                      "2013 - Scientific Reports article",
                    ],
                  ]}
                />
              </div>
            </div>
          </ProjectSection>
          <ProjectSection title="Wall Effects on Optically Trapped Spheres">
            <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
              <div className="my-4">
                <p>
                  Optical tweezers are often used to manipulate spheres that are
                  close to boundaries. During my PhD with the Optical
                  Micro-manipulation Group at The University of Queensland I
                  researched a range of analytical and numerical techniques for
                  calculating how these nearby boundaries affect the dynamics of
                  the trapped spheres. For example, the figure on the right
                  illustrates how the viscous forces on a trapped spinning
                  particle inside an artificial vesicle depend on how far it is
                  from the boundary. The red circles show the wall effects
                  measured by my colleague, and the green region shows the
                  theoretically computed values.
                </p>
                <LinkList
                  links={[
                    [
                      "https://doi.org/10.1103/PhysRevE.99.043304",
                      "2019 - Physical Review E article",
                    ],
                    [
                      "https://doi.org/10.1002/jbio.201900022",
                      "2019 - Journal of Biophotonics article",
                    ],
                    [
                      "https://doi.org/10.1039/C7LC01176H",
                      "2017 - Lab on a Chip article",
                    ],
                  ]}
                />
              </div>
              <img
                className="max-w-72 w-full mt-4 mb-auto aspect-square"
                src="/images/home/projects/optical_tweezers_wall_effects.webp"
                alt="Optical Tweezers"
              />
            </div>
          </ProjectSection>
        </div>
      </div>
    </>
  );
};

export default Home;
