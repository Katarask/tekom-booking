"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";

export default function EmbedDocsPage() {
  const [primaryColor, setPrimaryColor] = useState("0891b2");
  const [bgColor, setBgColor] = useState("ffffff");
  const [buttonStyle, setButtonStyle] = useState("default");
  const [buttonText, setButtonText] = useState("Termin buchen");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.de";

  const iframeCode = `<iframe
  src="${baseUrl}/embed/booking?primaryColor=${primaryColor}&bgColor=${bgColor}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 12px; max-width: 900px;"
></iframe>`;

  const widgetCode = `<!-- TEKOM Booking Widget -->
<script
  src="${baseUrl}/widget.js"
  data-primary-color="${primaryColor}"
  data-bg-color="${bgColor}"
  data-button-text="${buttonText}"
  data-button-style="${buttonStyle}"
></script>

<!-- Button to open booking modal -->
<button data-tekom-booking>
  ${buttonText}
</button>

<!-- Or use JavaScript API -->
<script>
  // Open modal programmatically
  TekomBooking.open();

  // Close modal
  TekomBooking.close();

  // Create a styled button
  TekomBooking.createButton('#my-container', {
    text: '${buttonText}',
    style: '${buttonStyle}'
  });

  // Listen for booking success
  window.addEventListener('tekomBookingSuccess', function(e) {
    console.log('Booking successful:', e.detail);
  });
</script>`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Embed Widget
        </h1>
        <p className="text-gray-600 mb-8">
          Binde den Buchungskalender auf deiner Website ein.
        </p>

        {/* Customization */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Anpassen
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hauptfarbe
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={`#${primaryColor}`}
                  onChange={(e) => setPrimaryColor(e.target.value.slice(1))}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value.replace("#", ""))}
                  className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                  placeholder="0891b2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hintergrundfarbe
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={`#${bgColor}`}
                  onChange={(e) => setBgColor(e.target.value.slice(1))}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value.replace("#", ""))}
                  className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                  placeholder="ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button-Text
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button-Stil
              </label>
              <select
                value={buttonStyle}
                onChange={(e) => setButtonStyle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="default">Ausgefuellt</option>
                <option value="outline">Umriss</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Vorschau
          </h2>
          <div
            className="rounded-lg p-8 flex items-center justify-center"
            style={{ backgroundColor: `#${bgColor}` }}
          >
            <button
              className="font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              style={
                buttonStyle === "default"
                  ? { backgroundColor: `#${primaryColor}`, color: "white" }
                  : buttonStyle === "outline"
                  ? {
                      backgroundColor: "transparent",
                      color: `#${primaryColor}`,
                      border: `2px solid #${primaryColor}`,
                    }
                  : {
                      backgroundColor: "transparent",
                      color: `#${primaryColor}`,
                    }
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {buttonText}
            </button>
          </div>
        </div>

        {/* Option 1: iFrame */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Option 1: iFrame Embed
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Einfachste Methode - direkt in deine Seite einbetten.
          </p>

          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm whitespace-pre-wrap">
              {iframeCode}
            </pre>
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(iframeCode)}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Code kopieren
          </button>
        </div>

        {/* Option 2: Widget */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Option 2: JavaScript Widget
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Button mit Modal-Popup. Flexibler und weniger Platz auf der Seite.
          </p>

          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm whitespace-pre-wrap">
              {widgetCode}
            </pre>
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(widgetCode)}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Code kopieren
          </button>
        </div>

        {/* Direct Link */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Option 3: Direkter Link
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Link zur Buchungsseite teilen.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`${baseUrl}/booking`}
              className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 font-mono text-sm"
            />
            <button
              onClick={() => navigator.clipboard.writeText(`${baseUrl}/booking`)}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              Kopieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
