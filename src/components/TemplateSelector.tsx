"use client";

const templates = ["modern"] as const;

type Template = (typeof templates)[number];

interface TemplateSelectorProps {
  selected: Template;
  onSelect: (template: Template) => void;
}

export function TemplateSelector({
  selected,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold text-center mb-8">Elige plantilla</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-8 justify-center min-w-max">
          {templates.map((t) => (
            <div
              key={t}
              className="text-center cursor-pointer"
              onClick={() => onSelect(t)}
            >
              <div
                className={`rounded-2xl shadow-2xl overflow-hidden transition-all ${selected === t ? "border-4 border-blue-500 scale-105" : "border-4 border-transparent"}`}
              >
                <img
                  src={`/previews/${t}.jpg`}
                  alt={t}
                  className="w-80 h-auto"
                />
              </div>
              <p className="mt-6 text-2xl font-bold capitalize">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
