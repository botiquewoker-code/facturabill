"use client";

import { useState } from "react";

const templates = [
  { id: "moderna", name: "Moderna", preview: "/previews/moderna.jpg" },
  { id: "clasica", name: "Clásica", preview: "/previews/clasica.jpg" }, // <- tu plantilla aquí
  { id: "minimal", name: "Minimal", preview: "/previews/minimal.jpg" },
];

interface TemplateSelectorProps {
  selected: string;
  onSelect: (templateId: string) => void;
}

export default function TemplateSelector({
  selected,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold text-center mb-8">Elige plantilla</h2>

      <div className="flex flex-wrap justify-center gap-8">
        {templates.map((t) => (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`
              cursor-pointer rounded-2xl shadow-2xl overflow-hidden transition-all duration-300
              ${selected === t.id ? "border-4 border-blue-600 scale-105" : "border-4 border-transparent hover:scale-105"}
            `}
          >
            <img
              src="/previews/clasica.jpg"
              alt="Clásica"
              className="w-80 h-96 object-cover"
            />
            <div className="p-4 bg-white text-center">
              <p className="text-2xl font-bold capitalize">{t.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
