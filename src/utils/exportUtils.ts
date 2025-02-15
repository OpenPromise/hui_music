import type { SearchResult } from "@/services/music";

type ExportFormat = "json" | "csv" | "txt";

function formatTrackForTxt(track: Track) {
  return `${track.name} - ${track.artist} (${track.album})`;
}

function formatTrackForCsv(track: Track) {
  return `"${track.name}","${track.artist}","${track.album}","${track.duration}"`;
}

export function exportSearchResults(results: SearchResult, format: ExportFormat) {
  let content = "";
  const timestamp = new Date().toISOString().split("T")[0];
  let filename = `search-results-${timestamp}`;
  let mimeType = "";

  switch (format) {
    case "json":
      content = JSON.stringify(results, null, 2);
      filename += ".json";
      mimeType = "application/json";
      break;

    case "csv":
      content = "Name,Artist,Album,Duration\n"; // CSV header
      content += results.tracks
        .map(formatTrackForCsv)
        .join("\n");
      filename += ".csv";
      mimeType = "text/csv";
      break;

    case "txt":
      content = results.tracks
        .map(formatTrackForTxt)
        .join("\n");
      filename += ".txt";
      mimeType = "text/plain";
      break;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 