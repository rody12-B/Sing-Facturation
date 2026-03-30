import { templates } from "../assets/assets";

const TemplateGrid = ({onTemplateClick}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {templates.map(({ id, label, image }) => (
        <div key={id}>
          <div
            className="border border-gray-300 rounded shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
            title={label}
            onClick={() => onTemplateClick(id)}
          >
            <img
              src={image}
              alt={label}
              className="w-full h-auto"
              loading="lazy"
            />
            <div className="p-2 text-center font-medium">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateGrid;
