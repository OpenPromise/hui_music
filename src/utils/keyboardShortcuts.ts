type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  handler: ShortcutHandler;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果用户正在输入，不触发快捷键
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const matchedShortcut = shortcuts.find(
        shortcut =>
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!shortcut.ctrl === e.ctrlKey &&
          !!shortcut.shift === e.shiftKey &&
          !!shortcut.alt === e.altKey
      );

      if (matchedShortcut) {
        e.preventDefault();
        matchedShortcut.handler(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
} 