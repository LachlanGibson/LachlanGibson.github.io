import React from "react";
import IconLinks from "../navigation/IconLinks";
import LinkList from "./LinkList";

const ProjectSection: React.FC<{
  id?: string;
  title: string;
  children: React.ReactNode;
  noTopBorder?: boolean;
}> = ({ id, title, children, noTopBorder = false }) => {
  return (
    <section
      id={id}
      className={`${noTopBorder ? "" : "border-t border-(--site-border)"} pt-6`}
    >
      <h3 className="text-xl leading-tight font-bold tracking-[0.01em] text-(--site-text) md:text-2xl">
        {title}
      </h3>
      <div className="mt-3 space-y-3 text-(--site-text) [&_p]:leading-6 [&_p]:text-justify">
        {children}
      </div>
    </section>
  );
};

const ThemedImage: React.FC<{
  darkSrc: string;
  lightSrc: string;
  alt: string;
  className?: string;
}> = ({ darkSrc, lightSrc, alt, className }) => {
  return (
    <>
      <img
        className={`theme-image-dark ${className ?? ""}`}
        src={darkSrc}
        alt={alt}
      />
      <img
        className={`theme-image-light ${className ?? ""}`}
        src={lightSrc}
        alt={alt}
      />
    </>
  );
};

const Home: React.FC = () => {
  return (
    <div className="space-y-10 pb-8 md:space-y-12">
      <section className="pb-8">
        <div className="grid items-start gap-8 pt-2 sm:grid-cols-[1fr_auto] sm:grid-rows-[auto_auto] sm:items-stretch sm:gap-x-12 sm:gap-y-6">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-(--site-link)/90 uppercase">
              Data Scientist and Developer
            </p>
            <h1 className="mt-2 text-4xl leading-tight font-bold tracking-tight text-(--site-text) md:text-5xl">
              Lachlan Gibson
            </h1>
            <p className="mt-2 text-base text-(--site-text-muted)">
              AI and Simulation
            </p>
            <IconLinks className="mt-3 flex h-5 w-28 justify-between" />
          </div>

          <div className="relative mx-auto aspect-square h-36 overflow-hidden border border-(--site-link) bg-(--site-surface-alt) sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:mx-0 sm:h-auto sm:w-52 sm:self-stretch sm:aspect-auto">
            <img
              className="h-full w-full object-cover"
              src="/images/home/lachlan_gibson_600.webp"
              alt="Lachlan Gibson"
            />
          </div>

          <p className="text-left text-(--site-text) sm:col-start-1 sm:row-start-2">
            I am a software engineer with a background in physics, simulation,
            AI, and mathematical modelling. My work spans research, teaching,
            and full-stack software development.
          </p>
        </div>
      </section>

      <section>
        <div className="flex min-h-24 items-center justify-center border-y border-(--site-border)">
          <h2 className="text-center text-3xl font-semibold tracking-[0.02em] text-(--site-text) md:text-4xl">
            Featured Projects
          </h2>
        </div>
        <div className="mt-6 space-y-8">
          <ProjectSection
            id="rare-event-simulation"
            title="Rare-Event Simulation via Generative Models"
            noTopBorder
          >
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
              for rare-event simulation. Our goal was to build a neural network
              framework for the simulation of independent random variables that
              could mimic arbitrary distributions, especially ones conditioned
              on rare events. The initial framework we developed included two
              neural networks that were trained simultaneously using a target
              function. One was a generative model and the other estimated the
              probability density function of the first. We later refined the
              framework to use a single{" "}
              <a
                href="https://en.wikipedia.org/wiki/Flow-based_generative_model"
                target="_blank"
                rel="noopener noreferrer"
              >
                Normalizing Flow generative model
              </a>
              , which could, in principle, approximate any sampling distribution
              arbitrarily well. The figures below show the model learning to
              approximate the target distribution of a truncated normal
              distribution.
            </p>
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <ThemedImage
                  className="home-plot-image aspect-square w-full"
                  darkSrc={`/images/home/projects/normalising_flows${i}.svg`}
                  lightSrc={`/images/home/projects/normalising_flows${i}_light.svg`}
                  alt={`Normalizing Flows ${i}`}
                  key={i}
                />
              ))}
            </div>
          </ProjectSection>

          <ProjectSection
            id="control-optimisation"
            title="Control Optimisation with Q-Learning and the Whittle Index"
          >
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
            <div className="overflow-hidden border border-(--site-border)">
              <iframe
                className="mx-auto aspect-video w-full"
                src={
                  "https://www.youtube.com/embed/XoKw-bsBH98?si=wfTz9eYaTs4GgZsL&amp;start=9"
                }
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen={true}
              />
            </div>
          </ProjectSection>

          <ProjectSection
            id="environmental-forecasting"
            title="Modelling and Forecasting Environmental Changes"
          >
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
            <ThemedImage
              className="home-plot-image mx-auto w-full max-w-2xl"
              darkSrc="/images/home/projects/GSLA_R2.svg"
              lightSrc="/images/home/projects/GSLA_R2_light.svg"
              alt="Sea level forecast"
            />
          </ProjectSection>

          <ProjectSection title="Categorical Vector Clustering using Denoising Autoencoders">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
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
                interpretable categories, such as party affiliation, which could
                be identified with a 99.5% accuracy.
              </p>
              <ThemedImage
                className="home-plot-image w-full max-w-lg"
                darkSrc="/images/home/projects/vote_model_robustness.svg"
                lightSrc="/images/home/projects/vote_model_robustness_light.svg"
                alt="Voting model robustness"
              />
            </div>
          </ProjectSection>

          <ProjectSection
            id="optical-tweezers-microrheology"
            title="Optical Tweezers Microrheology"
          >
            <p>
              Light carries momentum, and when a laser is tightly focused under
              a microscope, it can exert forces on microscopic objects. This is
              the principle behind optical tweezers, a powerful tool for
              manipulating very small particles. During my undergraduate and PhD
              studies I worked with the Optical Micro-manipulation Group at The
              University of Queensland to research and develop novel techniques
              to apply optical tweezers to the field of microrheology, measuring
              viscoelastic properties of fluids in very small volumes by
              tracking the motion of trapped particles.
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
          </ProjectSection>

          <ProjectSection
            id="wall-effects"
            title="Wall Effects on Optically Trapped Spheres"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
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
              <ThemedImage
                className="w-full max-w-72"
                darkSrc="/images/home/projects/optical_tweezers_wall_effects.webp"
                lightSrc="/images/home/projects/optical_tweezers_wall_effects_light.png"
                alt="Optical Tweezers wall effects"
              />
            </div>
          </ProjectSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
