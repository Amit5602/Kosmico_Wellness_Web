const mongoose = require('mongoose');
const crypto = require('crypto');

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  revokedAt: {
    type: Date,
  },
  replacedByToken: {
    type: String,
  },
  createdByIp: {
    type: String,
  }
}, {
  timestamps: true,
});

refreshTokenSchema.index({ user: 1 });
refreshTokenSchema.index({ token: 1 });
// TTL index automatically deletes expired tokens from the DB
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Ensure we don't store plain tokens, though it is high-entropy, we hash it for extra safety.
refreshTokenSchema.statics.hashToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Check if token is active
refreshTokenSchema.virtual('isActive').get(function () {
  return !this.revokedAt && Date.now() < this.expiresAt.getTime();
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
