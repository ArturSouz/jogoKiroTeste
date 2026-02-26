// System entity - container for activities
export class System {
  constructor(id, name, establishmentId) {
    this.id = id;
    this.name = name;
    this.establishmentId = establishmentId;
    this.bugs = [];
    this.enhancements = [];
  }

  /**
   * Add activity to system
   * @param {Activity} activity - Activity to add
   */
  addActivity(activity) {
    if (activity.type === 'bug') {
      this.bugs.push(activity);
    } else if (activity.type === 'enhancement') {
      this.enhancements.push(activity);
    }
  }

  /**
   * Get all activities
   * @returns {Activity[]} - All activities
   */
  getActivities() {
    return [...this.bugs, ...this.enhancements];
  }

  /**
   * Get completed activities
   * @returns {Activity[]} - Completed activities
   */
  getCompletedActivities() {
    return this.getActivities().filter(act => act.isCompleted);
  }

  /**
   * Get pending (non-completed) activities
   * @returns {Activity[]} - Pending activities
   */
  getPendingActivities() {
    return this.getActivities().filter(act => !act.isCompleted);
  }

  /**
   * Check if all activities are completed
   * @returns {boolean} - True if fully completed
   */
  isFullyCompleted() {
    const allActivities = this.getActivities();
    return allActivities.length > 0 && allActivities.every(act => act.isCompleted);
  }
}
