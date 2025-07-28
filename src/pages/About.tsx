import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Om oss</h1>
        <div className="prose prose-indigo">
          <p className="text-gray-600 mb-4">
            Velkommen til beste trainingssenter, din plattform for å oppdage og
            vurdere de beste treningssentrene. Vårt oppdrag er å hjelpe folk med
            å finne kvalitetstreningssentre gjennom autentiske anmeldelser og
            vurderinger fra ekte brukere.
          </p>
          <p className="text-gray-600 mb-4">
            Enten du leter etter faglig utvikling, ferdighetstrening eller
            utdanningsprogrammer, hjelper plattformen vår deg med å ta
            informerte beslutninger basert på tilbakemeldinger fra fellesskapet.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Hva vi tilbyr
          </h2>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li className="mb-2">Omfattende oppføringer av treningssentre</li>
            <li className="mb-2">Brukergenererte vurderinger og anmeldelser</li>
            <li className="mb-2">Enkel prosess for innsending av sentre</li>
            <li className="mb-2">Fellesskapsdrevet innhold</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default About;
