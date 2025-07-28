import React from "react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Meldingen er sendt!");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Kontakt Oss</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Navn
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-post
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Melding
            </label>
            <textarea
              id="message"
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button type="submit" className="w-full">
            Send Melding
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Contact;
