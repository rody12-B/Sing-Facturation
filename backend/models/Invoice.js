const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  reference: String,
  designation: String,
  price: Number,
  qty: Number,
  tva: Number,
  description: String,
  total: Number,
  totalTTC: Number,
});

const invoiceSchema = new mongoose.Schema(
  {
    company: {
      logo: String,
      name: String,
      email: String,
      number: String,
      address: String,
    },

    client: {
      raisonSocial: String,
      representative: String,
      phone: String,
      address: String,
      email: String,
    },

    invoice: {
      number: String,
      date: Date,
      dueDate: Date,
    },

    service: { subject: String },

    items: [itemSchema],

    account: {
      method: String,
      number: String,
      rib: String,
    },

    payment: {
      advanceAmount: { type: Number, default: 0 },
      advancePercent: { type: Number, default: 0 },
      advanceDate: Date,
      remainingAmount: { type: Number, default: 0 },
      remainingPercent: { type: Number, default: 0 },
      remainingDate: Date,
      totalPaid: { type: Number, default: 0 },
    },

    totals: {
      subtotal: Number,
      totalRemise: Number,
      totalTVA: Number,
      css: Number,
      total: Number,
    },

    statut: {
      type: String,
      enum: ["attente", "retard", "avance", "payee"],
      default: "attente",
    },
  },
  { timestamps: true }
);

// 🧠 Calcul automatique du statut
invoiceSchema.pre("save", function (next) {
  const total = this.totals?.total || 0;
  const advance = this.payment?.advanceAmount || 0;
  const remaining = this.payment?.remainingAmount ?? (total - advance);
  const dueDate = this.payment?.remainingDate
    ? new Date(this.payment.remainingDate)
    : null;
  const today = new Date();

  if (remaining <= 0 || advance >= total) this.statut = "payee";
  else if (advance > 0 && advance < total) this.statut = "avance";
  else if (remaining > 0 && dueDate && dueDate < today) this.statut = "retard";
  else this.statut = "attente";

  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
