export default (data: Record<string, unknown>) => ({
  id: `lead-${Date.now()}`,
  status: 'pending_review',
  ...data,
})
