import { deleteAttachment } from '../../../services/project';
import { getDeepValue, setDeepValue } from '../../../util';

export function convertData(data, project, parse, uneditable) {
    data = JSON.parse(JSON.stringify(data));
    project = JSON.parse(JSON.stringify(project));
    data.sections.forEach((section) => {
        section.subSections.forEach((subSection) => {
            if (subSection.contentType === 'project-details-form') {
                subSection.content.fields.forEach((el) => {
                    if (el.name) {
                        if (parse) {
                            el.value = project[el.name];
                            el.disabled = uneditable;
                        } else {
                            project[el.name] = el.value;
                        }
                    }
                });
            } else if (subSection.contentType === 'grid-layout') {
                subSection.content.sections.forEach((sec) => {
                    if (['rich-text-box', 'rich-text-box:header1'].includes(sec.component)) {
                        if (parse) {
                            sec.params.content = project.content[sec.dataKey];
                            sec.params.readOnly = uneditable;
                        } else {
                            project.content[sec.dataKey] = sec.params.content;
                        }
                    }
                    if ('rich-text-box:attachment' === sec.component) {
                        if (parse) {
                            sec.params.content = project.content[sec.dataKey]?.content;
                            sec.params.attachments = project.content[sec.dataKey]?.attachments;
                            sec.params.readOnly = uneditable;
                        } else {
                            const data = {
                                content: sec.params.content,
                                attachments: sec.params.attachments
                            };

                            // removing files those were presnt in last saved version but not in the current version
                            if (project.content[sec.dataKey]?.attachments?.length) {
                                const oldAttachments = project.content[sec.dataKey].attachments.map(
                                    (el) => el.filename
                                );
                                const newAttachments = sec.params.attachments.map(
                                    (el) => el.filename
                                );
                                const deletedAttachments = oldAttachments.filter(
                                    (el) => !newAttachments.includes(el)
                                );
                                deletedAttachments.forEach((el) => {
                                    deleteAttachment(el);
                                });
                            }
                            project.content[sec.dataKey] = data;
                        }
                    }
                });
            } else if (subSection.contentType === 'constraints-table') {
                subSection.content.tableParams.rowData.forEach((row) => {
                    if (parse) {
                        row['desc'] = getDeepValue(project.content, row.descDataKey);
                        row['descParams']['coldef']['cellEditorParams']['readOnly'] = uneditable;
                    } else {
                        setDeepValue(project.content, row.descDataKey, row['desc']);
                    }
                });
            }
        });
    });
    if (parse) {
        return data;
    } else {
        return project;
    }
}
