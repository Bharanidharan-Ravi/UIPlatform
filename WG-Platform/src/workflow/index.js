export function createWorkflowDefinition({ steps = [], transitions = [] } = {}) {
  const stepMap = new Map(steps.map((step) => [step.id, step]));

  return {
    steps,
    transitions,
    getStep: (id) => stepMap.get(id),
    getTransitionsFrom: (stepId) =>
      transitions.filter((transition) => transition.from === stepId),
    canTransition: (from, to, context) =>
      transitions.some((transition) => {
        const matches = transition.from === from && transition.to === to;
        return matches && (transition.guard ? transition.guard(context) : true);
      })
  };
}

export function getInitialWorkflowStep(definition) {
  return definition?.steps?.find((step) => step.initial) || definition?.steps?.[0];
}
