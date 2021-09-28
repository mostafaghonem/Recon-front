export default () => ({
  drawer: null,
  color: "info",
  image: require(`@/assets/images/background.jpg`),
  locations: {
    governates: [],
    recruitmentAreas: []
  },
  defaults: {
    RECOMMENDATION_TYPES: [],
    EDUCATION_RANKS: {},
    FORCES_LIST: {},
    ARMY_LIST: {},
    SITUATIONS: {},
    RECRUITMENT_LEVELS: {},
    EDUCATION_RANKS: [],
    FORCES_LIST: [],
    ARMY_LIST: [],
    SITUATIONS: [],
    RECRUITMENT_LEVELS: [],
    TREATMENTS: [],
    BRANCHES: [],
    COUNTRIES: [],
    COURSETYPES: [],
    COLLEGES: [],
    CRIMEMAJORLAWS: [],
    INFLUENCES_CATEGORIES: [],
    STAFF_CATEGORIES: [],
    MEDICAL_SITUATIONS: [],
    STAFF_RANKS: [],
    TREATMENTS_KEYS: {},
    EDUCATION_RANKS_KEYS: {}
  },
  unanswered: {
    MAILS: [],
    SIZE: 0
  },
  links: []
});
