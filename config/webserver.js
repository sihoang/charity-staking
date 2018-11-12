module.exports = {
  enabled: true,
  host: 'localhost',
  openBrowser: true,
  port: 8000,
  charityManagmentServ: process.env.CMS_URL || 'http://localhost:8001/api/v0',
};
