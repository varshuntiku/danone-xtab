export function isSubSectionCompleted(subSection) {
    if (subSection.contentType === 'project-details-form') {
        const fields = subSection.content.fields;
        for (var i in fields) {
            const el = fields[i];
            if (el.name) {
                if (!el.value) {
                    return false;
                }
            }
        }
    } else if (subSection.contentType === 'grid-layout') {
        const sections = subSection.content.sections;
        for (i in sections) {
            const sec = sections[i];
            if (['rich-text-box', 'rich-text-box:header1'].includes(sec.component)) {
                if (!sec.params.content || sec.params.content === '<p></p>\n') {
                    return false;
                }
            }
            if (sec.component === 'rich-text-box:attachment') {
                if (
                    (!sec.params.content || sec.params.content === '<p></p>\n') &&
                    !sec.params.attachments?.length
                ) {
                    return false;
                }
            }
        }
    } else if (subSection.contentType === 'constraints-table') {
        const rowData = subSection.content.tableParams.rowData;
        for (i in rowData) {
            const row = rowData[i];
            if (!row['desc'] || row['desc'] === '<p></p>\n') {
                return false;
            }
        }
    }

    return true;
}
