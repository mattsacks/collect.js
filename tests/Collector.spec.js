describe("setup", function() {
  describe("initialization", function() {
    it("exposes the right stuff", function() {
      expect(Collector).not.to.be(undefined);
      expect(collector).not.to.be(undefined);
      expect(window['utils']).to.be(undefined);
    });
  });
});
