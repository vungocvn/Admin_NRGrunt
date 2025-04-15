'use client'
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState, useRef } from "react";

const EditProductForm: React.FC<any> = ({
  editData,
  setEditdata,
  dataCategory,
  handleImageUpload,
  updateProduct,
  cancelProcess
}) => {
  const [previewImage, setPreviewImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (editData.image && (editData.image.startsWith("blob:") || editData.image.includes("/uploads"))) {
      setPreviewImage(editData.image);
    }
  }, [editData.image]);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setPreviewImage(blobUrl);
    setFileName(file.name);
    setFileSize(file.size);
    setEditdata({ ...editData, image: blobUrl });
    handleImageUpload(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setPreviewImage(blobUrl);
    setFileName(file.name);
    setFileSize(file.size);
    setEditdata({ ...editData, image: blobUrl });

    const dataTransferEvent = {
      target: { files: [file] }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleImageUpload(dataTransferEvent);
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setFileName("");
    setFileSize(0);
    setEditdata({ ...editData, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed top-0 right-0 w-[400px] h-screen bg-white shadow-lg z-[1000] overflow-y-auto animate-slide-in ">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#01ab78] bg-[#f0fdfa]">
        <h2 className="text-lg font-semibold text-[#01ab78]">
          {editData.id ? 'Edit Product' : 'Create Product'}
        </h2>
        <button
  onClick={cancelProcess}
  className="text-gray-500 text-2xl hover:text-red-500 hover:bg-transparent focus:outline-none transition-colors duration-300 ease-in-out"
>
  &times;
</button>

      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Image Product</label>
          <div
            ref={dropRef}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition ${isDragOver ? 'border-[#01ab78] bg-green-50' : 'hover:bg-gray-50'
              }`}
          >
            {previewImage ? (
              <div className="relative w-full group">
                <img src={previewImage} alt="Uploaded Product" className="mx-auto h-32 object-contain" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {fileName} ({formatFileSize(fileSize)})
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                <i className="fa fa-cloud-upload text-2xl mb-1" />
                <p>Kéo và thả ảnh hoặc click để tải lên</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name Product</label>
          <input
            type="text"
            placeholder="Enter name"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, name: e.target.value })}
            value={editData.name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            placeholder="Enter price"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, price: Number(e.target.value) })}
            value={editData.price}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, quantity: Number(e.target.value) })}
            value={editData.quantity}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Origin</label>
          <input
            type="text"
            placeholder="Enter origin"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, origin: e.target.value })}
            value={editData.origin}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <div className="flex items-center gap-2">
            <label className="switch">
              <input
                type="checkbox"
                checked={editData.status}
                onChange={(e) => setEditdata({ ...editData, status: e.target.checked })}
              />
              <span className="slider round"></span>
            </label>
            <span className="text-sm">{editData.status ? 'ON' : 'OFF'}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <input
            type="number"
            placeholder="Enter discount"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, discount: Number(e.target.value) })}
            value={editData.discount}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Editor
            apiKey="58ch4vcs9zi0g4x0gfk9dw4w3iib5zjkchtmfju9dw7cckip"
            onChange={(e) => {
              const content = e.target.getContent();
              setEditdata({ ...editData, description: content });
            }}
            initialValue={editData.description}
            init={{
              plugins: [
                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
                'image', 'link', 'lists', 'media', 'searchreplace',
                'table', 'visualblocks', 'wordcount'
              ],
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              menubar: 'file edit view insert format tools',
              browser_spellcheck: true,
              inputStyle: 'contenteditable',
              content_style: `
      body { font-family: Arial, sans-serif; font-size:14px; }
      img { display: block; margin: 0 auto; max-width: 100%; height: auto; }
    `,
              forced_root_block: 'p',
              convert_urls: false,
              entity_encoding: 'raw',
              setup: (editor: any) => {
                editor.on('init', () => {
                  editor.getBody().setAttribute('spellcheck', 'true');
                });

                editor.on('PastePostProcess', (e) => {
                  const images = e.node.querySelectorAll('img');
                  images.forEach((img:any) => {
                    img.removeAttribute('style');
                  });
                });
              }
            }}
          />

        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, category_id: Number(e.target.value) })}
            value={editData.category_id}
          >
            <option value={0}>Choose category</option>
            {dataCategory.map((item: any) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <button
            type="button"
            className="bg-[#01ab78] hover:bg-[#01946a] text-white px-4 py-2 rounded w-full"
            onClick={updateProduct}
          >
            <i className="fa-regular fa-floppy-disk"></i>
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded w-full"
            onClick={cancelProcess}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          border-radius: 50%;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: #4CAF50;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
        .tox {
          border-radius: 6px;
          border: 1px solid #d1d5db;
        }
        .tox .tox-toolbar,
        .tox .tox-statusbar {
          background-color: #f9fafb;
        }
        .tox .tox-edit-area__iframe {
          background-color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default EditProductForm;
