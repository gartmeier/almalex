import re
import unicodedata


def normalize_text(text):
    """Normalize text by removing excessive whitespace and linebreaks"""
    # First trim whitespace from beginning and end
    text = text.strip()
    # Replace any sequence of whitespace that includes 2+ newlines with two newlines
    text = re.sub(r"\s*\n\s*\n\s*(\n\s*)*", "\n\n", text)
    # Normalize Unicode characters
    text = unicodedata.normalize("NFKC", text)
    # Replace multiple spaces with a single space
    text = re.sub(r" {2,}", " ", text)
    return text


def split_text(text, separators=None, chunk_size=4000, chunk_overlap=200):
    separators = separators or ["\n\n", "\n", " ", ""]

    # Return an empty list if the text is empty
    if not text:
        return []

    # If the text fits within the chunk size, return it as a single chunk
    if len(text) <= chunk_size:
        return [text]

    # Get the appropriate separator for this level of recursion
    separator = separators[0] if separators else ""

    # If there's no separator left, just truncate the text
    if not separator:
        return [text[:chunk_size]]

    # Split the text by the current separator
    splits = text.split(separator)

    # If we only have one split or an empty split and there are more separators,
    # try the next separator in the list
    if len(splits) == 1 and len(separators) > 1:
        return split_text(
            text,
            separators=separators[1:],
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    # Process splits into chunks of the desired size with overlap
    chunks = []
    current_chunk = []
    current_length = 0

    for split in splits:
        split_length = len(split)

        # If adding this split would exceed the chunk size, process the current chunk
        if current_chunk and current_length + split_length > chunk_size:
            # Join the current chunk and add it to the list of chunks
            chunks.append(separator.join(current_chunk))

            # If we have overlap, keep some of the current chunk
            overlap_splits = []
            overlap_length = 0

            # Work backwards through current_chunk to create the overlap
            for item in reversed(current_chunk):
                if overlap_length + len(item) > chunk_overlap:
                    # We've exceeded the overlap size, stop here
                    break
                overlap_splits.insert(0, item)
                overlap_length += len(item) + len(separator)

            # Reset the current chunk with the overlap portion
            current_chunk = overlap_splits
            current_length = overlap_length

        # Add the current split to the current chunk
        current_chunk.append(split)
        current_length += split_length + len(separator)

    # Process any remaining text in the current chunk
    if current_chunk:
        chunks.append(separator.join(current_chunk))

    # For chunks that are still too large, recursively split them with the next separator
    if len(separators) > 1:
        final_chunks = []
        for chunk in chunks:
            if len(chunk) > chunk_size:
                final_chunks.extend(
                    split_text(
                        chunk,
                        separators=separators[1:],
                        chunk_size=chunk_size,
                        chunk_overlap=chunk_overlap,
                    )
                )
            else:
                final_chunks.append(chunk)
        return final_chunks

    return chunks
