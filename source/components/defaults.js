export default {
	color: {
		red: 30,
		orange: 60,
		yellow: 90,
		lime: 120,
		green: 150,
		teal: 180,
		cyan: 210,
		azure: 240,
		blue: 270,
		purple: 300,
		magenta: 330,
		pink: 360,
	},
	harmony: "default",
	harmonies: {
		default: {
			primary: {
				chromacity: 1,
				more: { rotation: 30, chromacity: 1 },
				less: { rotation: -30, chromacity: 1 },
			},
			secondary: {
				rotation: -60,
				chromacity: 1,
				more: { rotation: 30, chromacity: 1 },
				less: { rotation: -30, chromacity: 1 },
			},
		},
		analogous: {
			primary: {
				chromacity: 1,
				more: { rotation: 15, chromacity: 1 },
				less: { rotation: -15, chromacity: 1 },
			},
			secondary: {
				rotation: -30,
				chromacity: 1,
				more: { rotation: 15, chromacity: 1 },
				less: { rotation: -15, chromacity: 1 },
			},
		},
		complementary: {
			primary: {
				chromacity: 1,
				more: { rotation: 15, chromacity: 1 },
				less: { rotation: -15, chromacity: 1 },
			},
			secondary: {
				rotation: 180,
				chromacity: 1,
				more: { rotation: 15, chromacity: 1 },
				less: { rotation: -15, chromacity: 1 },
			},
		},
		monochromatic: {
			primary: {
				chromacity: 1,
				more: { rotation: 0, chromacity: 1 },
				less: { rotation: 0, chromacity: 1 },
			},
			secondary: {
				rotation: 0,
				chromacity: 1 / 2,
				more: { rotation: 0, chromacity: 1 / 2 },
				less: { rotation: 0, chromacity: 1 / 2 },
			},
		},
		split: {
			primary: {
				chromacity: 1,
				more: { rotation: 30, chromacity: 1 },
				less: { rotation: -30, chromacity: 1 },
			},
			secondary: {
				rotation: 180,
				chromacity: 1,
				more: { rotation: 30, chromacity: 1 },
				less: { rotation: -30, chromacity: 1 },
			},
		},
		triadic: {
			primary: {
				chromacity: 1,
				more: { rotation: 15, chromacity: 1 },
				less: { rotation: -15, chromacity: 1 },
			},
			secondary: {
				rotation: -120,
				chromacity: 1,
				more: { rotation: 15, chromacity: 1 },
				less: { rotation: -15, chromacity: 1 },
			},
		},
	},
	harmonize: 15,
	names: {
		dark: "Dark",
		light: "Light",
	},
	primary: 120,
	style: "neutral",
	styles: {
		neutral: {
			dark: {
				chroma: 0,
				chromacity: 1,
				offset: 0,
				variant: { chromacity: 0 },
			},
			light: {
				chroma: 0,
				chromacity: 1,
				offset: 0,
				variant: { chromacity: 0 },
			},
		},
		natural: {
			dark: {
				chroma: 5,
				chromacity: 3 / 4,
				offset: 1,
				variant: { chromacity: 1 / 3 },
			},
			light: {
				chroma: 5,
				chromacity: 1,
				offset: 3,
				variant: { chromacity: 1 / 3 },
			},
		},
		vibrant: {
			dark: {
				chroma: 10,
				chromacity: 1,
				offset: 1,
				variant: { chromacity: 1 / 3 },
			},
			light: {
				chroma: 10,
				chromacity: 1,
				offset: 2,
				variant: { chromacity: 1 / 3 },
			},
		},
	},
};
