import React, { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Prism } from "react-syntax-highlighter";
import { coy, okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const getThemeMode = () =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

const PythonCodeDisplay: React.FC<{
  codeFile: string;
  startOpen?: boolean;
  title?: string;
}> = ({ codeFile, startOpen = false, title = "Python Implementation" }) => {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(startOpen);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (typeof document === "undefined") return;

    setThemeMode(getThemeMode());
    const observer = new MutationObserver(() => {
      setThemeMode(getThemeMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCode = async () => {
      setLoading(true);
      setLoadFailed(false);

      try {
        const response = await fetch(codeFile);
        if (!response.ok) {
          throw new Error(`Failed to load ${codeFile}`);
        }

        const text = await response.text();
        if (!cancelled) {
          setCode(text);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
          setLoading(false);
        }
      }
    };

    void loadCode();

    return () => {
      cancelled = true;
    };
  }, [codeFile]);

  useEffect(() => {
    if (!copied) return;

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copied]);

  const codeStyle = useMemo(
    () => (themeMode === "light" ? coy : okaidia),
    [themeMode]
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const hasVisibleBody = showCode;

  return (
    <section className="my-5 overflow-hidden border border-(--site-border) bg-(--site-surface)">
      <div
        className={`flex flex-col gap-3 bg-(--site-surface-alt)/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
          hasVisibleBody ? "border-b border-(--site-border)" : ""
        }`}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-(--site-link) uppercase">
            {title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {copied && (
            <span className="text-sm text-(--site-link)">Copied</span>
          )}
          {showCode && !loading && !loadFailed && (
            <Button
              type="button"
              icon="pi pi-copy"
              label="Copy"
              onClick={() => void copyToClipboard()}
              outlined
              size="small"
            />
          )}
          <Button
            type="button"
            icon={showCode ? "pi pi-eye-slash" : "pi pi-code"}
            label={showCode ? "Hide Code" : "Reveal Code"}
            onClick={() => setShowCode((current) => !current)}
            size="small"
          />
        </div>
      </div>

      {showCode && loading && (
        <div className="px-4 py-5">
          <p className="font-['Share_Tech_Mono'] text-sm text-(--site-text-muted)">
            Loading code...
          </p>
        </div>
      )}

      {showCode && loadFailed && (
        <div className="px-4 py-5">
          <p className="text-sm text-(--site-warning)">
            The code snippet could not be loaded.
          </p>
        </div>
      )}

      {showCode && !loading && !loadFailed && (
        <div className="overflow-x-auto">
          <Prism
            language="python"
            style={codeStyle}
            customStyle={{
              margin: 0,
              padding: "1rem",
              borderRadius: 0,
              background:
                themeMode === "light"
                  ? "var(--site-surface)"
                  : "var(--site-bg)",
            }}
            codeTagProps={{
              style: {
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: "0.95rem",
              },
            }}
            showLineNumbers
            wrapLongLines={false}
          >
            {code}
          </Prism>
        </div>
      )}
    </section>
  );
};

export default PythonCodeDisplay;
