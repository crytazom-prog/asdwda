/* Сбалансированные наборы: по пять заданий каждого раздела. */
(function () {
  "use strict";
  const sections = ["1.1", "1.2", "1.3", "1.4"];

  function shuffled(items, random = Math.random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function build(pool, history, random = Math.random) {
    const next = {};
    const deck = sections.flatMap(section => {
      const available = pool.filter(task => task.section === section);
      if (available.length < 5) throw new Error("Недостаточно заданий в разделе " + section);

      let pastSets = history[section] || [];
      if (Array.isArray(pastSets) && pastSets.every(item => typeof item === "string")) pastSets = [pastSets];
      pastSets = pastSets.filter(set => Array.isArray(set));
      const used = pastSets.flat().filter(id => available.some(task => task.id === id));
      const unseen = available.filter(task => !used.includes(task.id));
      let selected;
      let sectionHistory;

      if (unseen.length >= 5) {
        selected = shuffled(unseen, random).slice(0, 5);
        sectionHistory = [...pastSets, selected.map(task => task.id)];
      } else {
        // Банк исчерпан: начинаем новый цикл, но не повторяем задания прошлого среза.
        const recent = pastSets.length ? pastSets[pastSets.length - 1] : [];
        const candidates = available.filter(task => !recent.includes(task.id));
        const base = candidates.length >= 5 ? candidates : available;
        selected = shuffled(base, random).slice(0, 5);
        sectionHistory = [selected.map(task => task.id)];
      }

      next[section] = sectionHistory;
      return selected;
    });
    // Блоки идут по разделам: 1.1 → 1.2 → 1.3 → 1.4, по пять заданий.
    // Перемешивание происходит только внутри каждого блока.
    return { deck, history: next };
  }

  window.BIMExam = { build, sections };
})();
