// export default function extractArticleInfo(articleText) {
module.exports = function extractArticleInfo(articleText) {
  const extractedInfo = { title: null, summary: [] };

  // Regex to find the main title (starts with # and goes until the next newline)
  // The 'm' flag enables multiline mode, allowing ^ and $ to match start/end of lines.
  const titleMatch = articleText.match(/^#\s*(.*?)\n/m);
  if (titleMatch) {
    extractedInfo.title = titleMatch[1].trim();
  }

  // Regex to find the summary points.
  // The 's' flag (dotAll) allows '.' to match newlines.
  const summaryBlockMatch = articleText.match(
    /(Bias Comparison\s*Bias Comparison\s*)(.*?)(?=Insights by Ground AI)/s,
  );

  if (summaryBlockMatch && summaryBlockMatch[2]) {
    const summaryBlock = summaryBlockMatch[2];
    // Find all lines within this block that start with '-'
    // The 'g' flag finds all occurrences, not just the first.
    // The 'm' flag is important here for `^` to match the start of each line in the `summaryBlock`.
    const summaryPoints = summaryBlock.match(/^- (.*?)(?=\n|$)/gm);

    if (summaryPoints) {
      const cleanedSummaryPoints = summaryPoints.map((point) => {
        // Remove the leading '- '
        let cleanedPoint = point.substring(2).trim();
        // Clean up any potential markdown links like [Anthony Albanese](...)
        cleanedPoint = cleanedPoint.replace(/\[(.*?)\]\(.*?\)/g, '$1');
        return cleanedPoint;
      });
      extractedInfo.summary = cleanedSummaryPoints;
    }
  }

  return extractedInfo;
}