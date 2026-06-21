export type Attraction = {
  name: string;
  blurb: string;
  tag: string;
  bestTime: string;
};

export type Dish = {
  name: string;
  description: string;
  emoji: string;
  kind: "Street food" | "Main" | "Dessert" | "Drink";
};

export type CultureNote = {
  title: string;
  detail: string;
};

export type Phrase = {
  original: string;
  pronunciation: string;
  meaning: string;
};

export type LocationGuide = {
  location: string;
  country: string;
  tagline: string;
  heroImage: string;
  attractions: Attraction[];
  cuisine: Dish[];
  culture: {
    history: string;
    norms: CultureNote[];
  };
  language: {
    primary: string[];
    phrases: Phrase[];
  };
};
