class WaterFactsService {
    private facts: string[];
    static facts: any;

    constructor() {
        this.facts = [
            "Water covers about 71% of the Earth's surface.",
            "97% of the Earth's water is found in the oceans.",
            "Only 2.5% of the Earth's water is fresh water.",
            "The human body is about 60% water.",
            "A person can live about a month without food, but only about a week without water.",
            "Water expands by 9% when it freezes.",
            "Water is the only substance that naturally exists in all three physical states: solid, liquid, and gas.",
            "Water is a universal solvent, which means it can dissolve more substances than any other liquid.",
            "Water regulates the Earth's temperature.",
            "There is the same amount of water on Earth as there was when the Earth was formed.",
            "At birth, water accounts for approximately 80% of an infant's body weight.",
            "Water helps to transport nutrients and oxygen to cells.",
            "Water helps to convert food into energy.",
            "Water makes up about 70% of the human brain.",
            "A jellyfish and a cucumber are each 95% water.",
            "The weight a person loses directly after intense physical activity is weight from water, not fat.",
            "Water helps to regulate the body's temperature.",
            "Pure water has a neutral pH of 7.",
            "A person needs about 2.5 quarts of water per day to maintain health.",
            "By the time a person feels thirsty, their body has lost over 1% of its total water amount.",
            "Drinking enough water can help maintain healthy skin.",
            "Staying hydrated can improve concentration and cognition.",
            "Drinking water can help with weight management by promoting a feeling of fullness.",
            "Proper hydration can enhance physical performance during exercise.",
            "Water aids in digestion and helps prevent constipation.",
            "Water helps to maintain normal kidney function.",
            "Adequate water intake can improve mood and energy levels.",
            "Drinking water can help flush out toxins from the body.",
            "Water helps to cushion and lubricate joints."
        ];
    }

    public getRandomFact(): string {
        const randomIndex = Math.floor(Math.random() * this.facts.length);
        return this.facts[randomIndex];
    }
}

export default WaterFactsService;