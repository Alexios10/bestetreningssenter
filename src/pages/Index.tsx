import Layout from "../components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Training Hub Reviews
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find and rate the best training centers in your area
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Start exploring
        </a>
      </div>
    </Layout>
  );
};

export default Index;
