const TEMPLATE_REGEX = /{{\s*([^}\s]+)\s*}}/g;

export const printText = (template, values = {}) => {
    const outputText = template.replace(TEMPLATE_REGEX, (match, property) => {
        return values[property] ? values[property] : match;
    });
    return outputText;
};
