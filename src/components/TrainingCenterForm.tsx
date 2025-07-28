import React, { useState } from "react";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";

interface TrainingCenterFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    imageUrl: string;
  }) => void;
  onCancel: () => void;
  hideHeader?: boolean;
}

const TrainingCenterForm: React.FC<TrainingCenterFormProps> = ({
  onSubmit,
  onCancel,
  hideHeader = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);

    // Simulate async operation
    setTimeout(() => {
      onSubmit({ title, description, imageUrl });
      setTitle("");
      setDescription("");
      setImageUrl("");
      setIsSubmitting(false);
      toast.success("Training center added successfully!");
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg">
      {!hideHeader && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Add New Training Center
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter center name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter center description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image
          </label>
          <div className="mt-1 flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload size={20} className="text-gray-500" />
              <span className="text-sm text-gray-600">Upload Image</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
            {imageUrl && (
              <span className="text-sm text-green-600">Image selected</span>
            )}
          </div>
        </div>

        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md bg-gray-100"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center min-w-[100px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingCenterForm;
