import FormattedText from "../components/FormattedText/FormattedText";

export const formatText = (text) => {
  if (!text) return null;

  const textParts = text.split(/(\*\*\*\*[^*]+\*\*\*\*|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|--[^-]+--)/g);
  const boldRegex = /^\*\*\*[^*]+\*\*\*$/;
  const italicRegex = /^\*\*[^*]+\*\*$/;
  const underlineRegex = /^--[^--]+--$/;
  const boldAndItalicRegex = /^\*\*\*\*[^*]+\*\*\*\*$/;
  const boldAndUnderlineRegex = /^\*\*--[^*]+--\*\*$|^--\*\*[^*]+\*\*--$/;
  const italicAndUnderlineRegex = /^\*\*\*--[^*]+--\*\*\*$|^--\*\*\*[^*]+\*\*\*--$/;
  const boldItalicAndUnderlineRegex = /^\*\*\*\*--[^*]+--\*\*\*\*$|^--\*\*\*\*[^*]+\*\*\*\*--$/;

  const textStyle = {
    bold: "formattedText-bold",
    italic: "formattedText-italic",
    underline: "formattedText-underline",
    boldAndItalic: "formattedText-bold formattedText-italic",
    boldAndUnderline: "formattedText-bold formattedText-underline",
    italicAndUnderline: "formattedText-italic formattedText-underline",
    boldItalicAndUnderline: "formattedText-bold formattedText-italic formattedText-underline",
  };

  return textParts.map((part, index) => {
    // Bold and Italic and underline text
    if (boldItalicAndUnderlineRegex.test(part)) {
      return (
        <FormattedText key={index} style={textStyle.boldItalicAndUnderline}>
          {part.slice(6, -6)}
        </FormattedText>
      );
    }

        // Italic and underline text
    if (italicAndUnderlineRegex.test(part)) {
      return (
        <FormattedText key={index} style={textStyle.italicAndUnderline}>
          {part.slice(5, -5)}
        </FormattedText>
      );
    }

          // Bold and underline text
    if (boldAndUnderlineRegex.test(part)) {
      return (
        <FormattedText key={index} style={textStyle.boldAndUnderline}>
          {part.slice(4, -4)}
        </FormattedText>
      );
    }

        // Bold and italic text
    if (boldAndItalicRegex.test(part)) {
      return (
        <FormattedText key={index} style={textStyle.boldAndItalic}>
          {part.slice(4, -4)}
        </FormattedText>
      );
    }

        // Bold text
    if (boldRegex.test(part)) {
      return (
        <FormattedText key={index} style={textStyle.bold}>
          {part.slice(3, -3)}
        </FormattedText>
      );
    }

    
    // Italic text
    if (italicRegex.test(part)) {
      return (
        <FormattedText key={index} style={textStyle.italic}>
          {part.slice(2, -2)}
        </FormattedText>
      );
    }

    // Underline text
    if (underlineRegex.test(part)) {
      return (
        <FormattedText key={index} style={textStyle.underline}>
          {part.slice(2, -2)}
        </FormattedText>
      );
    }


    // Default text
    return <FormattedText key={index} >{part}</FormattedText>;
  });
};