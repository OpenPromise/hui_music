"use client";

import { X, Keyboard } from "lucide-react";

interface ShortcutsHelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    description: string;
  }[];
}

export default function ShortcutsHelpDialog({
  isOpen,
  onClose,
  shortcuts,
}: ShortcutsHelpDialogProps) {
  if (!isOpen) return null;

  const formatKey = (key: string) => {
    switch (key) {
      case "Escape":
        return "Esc";
      case "ArrowUp":
        return "↑";
      case "ArrowDown":
        return "↓";
      case "ArrowLeft":
        return "←";
      case "ArrowRight":
        return "→";
      default:
        return key.toUpperCase();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Keyboard size={20} />
            <h2 className="text-xl font-bold">键盘快捷键</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <span>{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.ctrl && (
                  <kbd className="px-2 py-1 bg-white/10 rounded text-sm">
                    Ctrl
                  </kbd>
                )}
                {shortcut.shift && (
                  <kbd className="px-2 py-1 bg-white/10 rounded text-sm">
                    Shift
                  </kbd>
                )}
                {shortcut.alt && (
                  <kbd className="px-2 py-1 bg-white/10 rounded text-sm">
                    Alt
                  </kbd>
                )}
                <kbd className="px-2 py-1 bg-white/10 rounded text-sm">
                  {formatKey(shortcut.key)}
                </kbd>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 