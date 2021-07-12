module.exports = {
    PORT: process.env.PORT || 9090,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/blogful',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder_mifflin@localhost/blogful-test',
    NODE_ENV: process.env.NODE_ENV || 'development',
  }