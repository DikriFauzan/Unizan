import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

class FlowithCore:
    def __init__(self):
        self.memory = []
        self.vectorizer = TfidfVectorizer()

    def embed(self, texts):
        # Convert texts to vector space
        return self.vectorizer.fit_transform(texts).toarray()

    def expand_context(self, prompt, depth=3):
        # Pseudo "deep reasoning"
        layers = []
        current = prompt

        for i in range(depth):
            # Generate synthetic vector hash
            vec = np.random.rand(8)
            h = "-".join([str(round(v, 3)) for v in vec])

            layers.append(
                f"[FLOWITH DEPTH {i+1}] VectorHash:{h} -> Expanding logical branches..."
            )
            layers.append(
                f"   > Branch {i+1} considers structural, logical, and semantic divergence."
            )

        return "\n".join(layers)

    def run(self, prompt: str, depth: int):
        trace = []
        trace.append(f"[FLOWITH AGENT] Processing: '{prompt}'")
        trace.append(self.expand_context(prompt, depth))
        trace.append("[SYNTHESIS] Final interpretation complete.")
        return "\n".join(trace)
