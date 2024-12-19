from fuzzywuzzy import fuzz


class response_fact_check:
    def map_response_chunk_to_source_slide(self, response):
        """
        PPT Slide mapping for the LLM generated response for fact checking. 'Fuzzy partial score' is being used for mapping the response chunks to PPT slides.
        @response: LLM Response
        """
        response_result = response["result"]
        response_source_docs = response["source_documents"]
        paragraphs_split = response_result.split("\n")
        paragraph_citation_mapping = []
        for para in paragraphs_split:
            metadata_lists = []
            meta_track_dict = {}
            response_line = para.split(".")
            for i in response_line:
                if not i:
                    continue
                fuzzy_partial_score = []
                for j in response_source_docs:
                    fuzz_score = fuzz.partial_ratio(i.lower(), j.page_content.lower())
                    fuzzy_partial_score.append((fuzz_score, j.metadata))
                res = max(fuzzy_partial_score, key=lambda i: i[0])[1]
                if (
                    not meta_track_dict.get(res.get("doc_name"))
                    or (res.get("slide_number") and res.get("slide_number") not in meta_track_dict[res.get("doc_name")])
                    or (res.get("page_number") and res.get("page_number") not in meta_track_dict[res.get("doc_name")])
                ):
                    metadata_lists.append(res)
                if meta_track_dict.get(res.get("doc_name")):
                    if res.get("slide_number"):
                        meta_track_dict[res.get("doc_name")].append(res.get("slide_number"))
                    else:
                        meta_track_dict[res.get("doc_name")].append(res.get("page_number"))
                else:
                    if res.get("slide_number"):
                        meta_track_dict[res.get("doc_name")] = [res.get("slide_number")]
                    else:
                        meta_track_dict[res.get("doc_name")] = [res.get("page_number")]
            paragraph_citation_mapping.append((para, metadata_lists))
        return paragraph_citation_mapping
