export const SubscriptionTemplate = {
  welcomeRelay() {
    return {
      content: `Welcome to Jellyfish - Premium Access Activated!

Thank you for subscribing to the Jellyfish ecosystem! 🎉 Your premium access is now active.

Here’s what you need to get started:
✅ Relay URL: wss://jellyfish.land
✅ Support: @nostr:npub1hu47u55pzjw8cdg0t5f2uvh4znrcvnl3pqz3st6p0pfcctzzzqrsplc46u
📨 hi@dezh.tech

Stay Immortal!🪼
- Jellyfish Team`,
    };
  },

  welcomeNip05(fullIdentifier: string) {
    return {
      subject: 'Welcome to Jellyfish - Your NIP-05 is Live! 🪼',
      content: `Welcome to Jellyfish - Your NIP-05 is Live! 🪼

We're excited to have you on board! Your NIP-05 identity **${fullIdentifier}** is now live.

✅ Resolvable via ${fullIdentifier}
✅ Follow us: @nostr:npub1hu47u55pzjw8cdg0t5f2uvh4znrcvnl3pqz3st6p0pfcctzzzqrsplc46u
📨 hi@dezh.tech

Stay Immortal!🪼
- Jellyfish Team`,
    };
  },

  expired() {
    return {
      subject: 'Your Jellyfish Subscription Has Expired',
      content: `Your subscription to Jellyfish has expired.

🔄 Renew Now: https://jellyfish.land/relay
🚀 Relay URL: wss://jellyfish.land (Access restricted)
📨 hi@dezh.tech

Stay Immortal 🪼 - See you soon!
- Jellyfish Team`,
    };
  },

  reminder(days: number) {
    return {
      subject: `Reminder: Your Subscription Expires in ${days} Day${days > 1 ? 's' : ''}`,
      content: `Your subscription will expire in **${days} day${days > 1 ? 's' : ''}**.

🔄 Renew: https://jellyfish.land/relay
🚀 Relay: wss://jellyfish.land
📨 hi@dezh.tech

Stay Immortal!🪼
- Jellyfish Team`,
    };
  },
};
