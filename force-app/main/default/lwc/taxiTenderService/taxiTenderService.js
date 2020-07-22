export default {
  getEntityTypes() {
    return [
      { label: "Individual", value: "Individual" },
      { label: "Corporation", value: "Corporation" },
      { label: "Joint holders", value: "Joint holders" }
    ];
  },

  getJointHolderTypes() {
    return [
      { label: "Individual", value: "Individual" },
      { label: "Corporation", value: "Corporation" }
    ];
  },

  getPrefContactMethodValues() {
    return [
      { label: "Email", value: "Email" },
      { label: "Mail", value: "Mail" }
    ];
  }
};