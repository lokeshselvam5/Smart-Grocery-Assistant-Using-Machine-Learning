"""
grocery_intents_dataset.py

Grocery Shop Assistant — intents dataset, built the same way as the
Infiheal mental-health chatbot notebook:

    tag        -> the intent/category of the customer query
    patterns   -> example ways a customer might phrase that query
    responses  -> friendly, grocery-related answers the bot can pick from

USAGE (mirrors the notebook workflow):

    from grocery_intents_dataset import INTENTS, build_dataframe, save_as_json

    df = build_dataframe(INTENTS)   # one row per pattern, ready for training
    save_as_json(INTENTS, "grocery_intents.json")  # if you want the .json too

You can then feed `df` into the exact same tokenizer -> LabelEncoder ->
Dense/LSTM classifier pipeline used in the mental-health notebook:
tokenize `patterns`, encode `tag` as the label, train the classifier,
and at inference time predict the tag for a new customer message and
reply with a random pick from that tag's `responses`.
"""

import json
import random
import pandas as pd


# ---------------------------------------------------------------------------
# 1. INTENTS DATASET
# ---------------------------------------------------------------------------
INTENTS = [
    {
        "tag": "greeting",
        "patterns": [
            "Hi", "Hello", "Hey there", "Good morning", "Good evening",
            "Is anyone there?", "Hey", "Namaste"
        ],
        "responses": [
            "Hi there! Welcome to our grocery store 🛒 How can I help you today?",
            "Hello! Looking for something specific, or just browsing today?",
            "Hey! Great to see you — what can I help you find?"
        ]
    },
    {
        "tag": "goodbye",
        "patterns": [
            "Bye", "See you later", "Goodbye", "That's all, thanks", "I'm done",
            "Talk to you later"
        ],
        "responses": [
            "Thanks for stopping by! Have a great day and happy cooking 🥗",
            "Goodbye! Come back soon for more fresh picks.",
            "See you next time! Don't forget your grocery list next visit."
        ]
    },
    {
        "tag": "thanks",
        "patterns": [
            "Thank you", "Thanks a lot", "That's helpful, thanks", "Appreciate it",
            "Thanks for the help"
        ],
        "responses": [
            "You're very welcome! Anything else I can help you find?",
            "Happy to help! Let me know if you need anything else.",
            "Anytime! That's what I'm here for."
        ]
    },
    {
        "tag": "store_hours",
        "patterns": [
            "What time do you open?", "When do you close?", "Are you open now?",
            "What are your store hours?", "Are you open on Sundays?",
            "Do you open on holidays?"
        ],
        "responses": [
            "We're open daily from 8 AM to 10 PM, including Sundays!",
            "Our store hours are 8 AM – 10 PM every day. On public holidays we may close a bit early, so it's worth checking ahead.",
        ]
    },
    {
        "tag": "store_location",
        "patterns": [
            "Where are you located?", "What's your address?", "How do I get to your store?",
            "Do you have a store near me?", "Which branches do you have?"
        ],
        "responses": [
            "You can find our store locations and directions on our website's 'Store Locator' page.",
            "Share your area with us and we'll point you to the nearest branch!"
        ]
    },
    {
        "tag": "delivery_info",
        "patterns": [
            "Do you deliver?", "How long does delivery take?", "Is home delivery available?",
            "What's your delivery time?", "Can I get same-day delivery?",
            "Do you deliver to my area?"
        ],
        "responses": [
            "Yes, we offer home delivery! Most orders arrive within 60–90 minutes of placing them.",
            "We deliver daily, and same-day delivery is available for orders placed before 6 PM.",
            "Delivery is available in most areas — just enter your pincode at checkout to confirm."
        ]
    },
    {
        "tag": "delivery_charges",
        "patterns": [
            "Is delivery free?", "How much do you charge for delivery?",
            "What's the delivery fee?", "Do I get free delivery on big orders?"
        ],
        "responses": [
            "Delivery is free on orders above ₹499. Below that, a small delivery fee of ₹30 applies.",
            "We offer free delivery for larger orders — smaller orders carry a minimal delivery charge."
        ]
    },
    {
        "tag": "order_tracking",
        "patterns": [
            "Where is my order?", "Can I track my order?", "My order hasn't arrived yet",
            "How do I check my order status?", "Track my delivery"
        ],
        "responses": [
            "You can track your order in real time from the 'My Orders' section of the app or website.",
            "Sure! Just share your order ID and I can help you check its status."
        ]
    },
    {
        "tag": "payment_methods",
        "patterns": [
            "What payment methods do you accept?", "Can I pay by card?",
            "Do you accept UPI?", "Is cash on delivery available?",
            "Can I pay online?"
        ],
        "responses": [
            "We accept UPI, credit/debit cards, net banking, and cash on delivery.",
            "You can pay online via UPI or card, or choose cash on delivery — whatever's easiest for you!"
        ]
    },
    {
        "tag": "return_policy",
        "patterns": [
            "Can I return a product?", "What's your return policy?",
            "I received a damaged item", "How do refunds work?",
            "Can I exchange this product?"
        ],
        "responses": [
            "No worries! If an item arrives damaged or expired, you can request a replacement or refund within 24 hours of delivery.",
            "You can return most products within 24 hours of delivery for a full refund — just raise a request from 'My Orders'."
        ]
    },
    {
        "tag": "product_availability",
        "patterns": [
            "Do you have fresh tomatoes?", "Is milk in stock?", "Do you sell organic vegetables?",
            "Do you have basmati rice?", "Is this product available?",
            "Do you stock gluten-free items?"
        ],
        "responses": [
            "Let me check that for you — could you tell me the exact product or brand you're looking for?",
            "We usually stock a wide range of fresh produce and pantry staples — search the item name in the app to confirm live availability."
        ]
    },
    {
        "tag": "out_of_stock",
        "patterns": [
            "This item is out of stock", "Why is this product unavailable?",
            "When will you restock this?", "Can you notify me when it's back in stock?"
        ],
        "responses": [
            "Sorry about that! You can tap 'Notify Me' on the product page and we'll alert you the moment it's restocked.",
            "That item is temporarily out of stock — restocks usually happen within a couple of days."
        ]
    },
    {
        "tag": "price_inquiry",
        "patterns": [
            "How much does this cost?", "What's the price of onions?",
            "Is there a price for bulk milk?", "How much for a dozen eggs?"
        ],
        "responses": [
            "Prices vary by weight/pack size — you'll see the exact price listed on the product page.",
            "Great question! Prices update daily based on fresh produce rates, so please check the live listing for the exact cost."
        ]
    },
    {
        "tag": "discounts_offers",
        "patterns": [
            "Do you have any discounts?", "Are there ongoing offers?",
            "Is there a coupon code?", "Any deals today?", "Do you have combo offers?"
        ],
        "responses": [
            "Yes! Check the 'Offers' tab in the app for today's deals and coupon codes.",
            "We usually run weekly discounts on fruits, vegetables, and dairy — take a look at our Offers page for the latest ones."
        ]
    },
    {
        "tag": "loyalty_membership",
        "patterns": [
            "Do you have a loyalty program?", "How do I earn reward points?",
            "What are the benefits of membership?", "How do I join your rewards program?"
        ],
        "responses": [
            "Yes! Our loyalty program lets you earn points on every purchase, redeemable for discounts on future orders.",
            "Sign up for our membership program to get exclusive offers, early access to sales, and reward points on every order."
        ]
    },
    {
        "tag": "freshness_quality",
        "patterns": [
            "How fresh are your vegetables?", "Do you guarantee quality?",
            "Are your fruits fresh?", "How do you ensure freshness?"
        ],
        "responses": [
            "We source fruits and vegetables fresh daily from local farms and quality-check every batch before it reaches you.",
            "Freshness is our priority! If anything doesn't meet quality standards, we offer an easy replacement or refund."
        ]
    },
    {
        "tag": "bulk_orders",
        "patterns": [
            "Can I place a bulk order?", "Do you offer wholesale prices?",
            "I need groceries for an event", "Do you do bulk discounts?"
        ],
        "responses": [
            "Absolutely! For bulk orders, reach out to our support team and we'll set you up with special pricing.",
            "Yes, we support bulk and wholesale orders — great for events or businesses. Contact us for a custom quote."
        ]
    },
    {
        "tag": "dietary_allergy_info",
        "patterns": [
            "Do you have gluten-free products?", "Is this vegan?",
            "Do you sell sugar-free items?", "Are these nuts allergen-free?",
            "Do you have lactose-free milk?"
        ],
        "responses": [
            "Yes, we carry a range of gluten-free, vegan, and sugar-free products — you can filter by dietary preference in the app.",
            "Product labels list all allergen information, but let me know the specific product and I can double-check for you."
        ]
    },
    {
        "tag": "recipe_suggestion",
        "patterns": [
            "What can I cook with tomatoes and onions?", "Suggest a quick dinner recipe",
            "What ingredients do I need for pasta?", "Give me a healthy recipe idea"
        ],
        "responses": [
            "How about a simple tomato-onion curry? I can also suggest the exact ingredients to add to your cart if you'd like!",
            "For a quick, healthy meal, try a veggie stir-fry — want me to list out the ingredients you'll need?"
        ]
    },
    {
        "tag": "cancel_order",
        "patterns": [
            "I want to cancel my order", "Can I cancel this order?",
            "How do I cancel an order?", "Cancel my recent purchase"
        ],
        "responses": [
            "You can cancel your order from 'My Orders' as long as it hasn't been dispatched yet.",
            "No problem — go to 'My Orders', select the order, and tap 'Cancel'. If it's already out for delivery, our support team can help instead."
        ]
    },
    {
        "tag": "complaint",
        "patterns": [
            "I have a complaint", "My order was wrong", "I'm not happy with my delivery",
            "The delivery guy was rude", "This is not what I ordered"
        ],
        "responses": [
            "I'm really sorry to hear that. Could you share your order ID so I can get this sorted out for you right away?",
            "Sorry for the trouble — that's not the experience we want for you. Let's fix this; please share a few details about the issue."
        ]
    },
    {
        "tag": "app_help",
        "patterns": [
            "How do I use the app?", "I can't find the checkout button",
            "How do I add items to cart?", "The app isn't loading properly"
        ],
        "responses": [
            "I can help with that! Could you tell me exactly where you're stuck — browsing, cart, or checkout?",
            "Sorry for the hassle. Try restarting the app first; if the issue continues, I can connect you to our tech support."
        ]
    },
    {
        "tag": "small_talk",
        "patterns": [
            "How are you?", "What's up?", "Are you a robot?", "Who made you?"
        ],
        "responses": [
            "I'm doing great, thanks for asking! I'm your friendly grocery shop assistant, here to help with anything store-related 😊",
            "I'm your grocery assistant bot — always happy to help you shop smarter!"
        ]
    },
]


# ---------------------------------------------------------------------------
# 2. DATAFRAME BUILDER — same flattening logic as the mental-health notebook
# ---------------------------------------------------------------------------
def build_dataframe(intents=INTENTS):
    """
    Flattens the intents list into a DataFrame with one row per pattern,
    exactly like the notebook's:

        dic = {"tag": [], "patterns": [], "responses": []}
        for i in range(len(df)):
            ...

    Returns
    -------
    pandas.DataFrame with columns: tag, patterns, responses
    """
    df = pd.DataFrame(intents)

    dic = {"tag": [], "patterns": [], "responses": []}
    for i in range(len(df)):
        ptrns = df.loc[i, "patterns"]
        rspns = df.loc[i, "responses"]
        tag = df.loc[i, "tag"]
        for pattern in ptrns:
            dic["tag"].append(tag)
            dic["patterns"].append(pattern)
            dic["responses"].append(rspns)

    return pd.DataFrame.from_dict(dic)


# ---------------------------------------------------------------------------
# 3. Helpers
# ---------------------------------------------------------------------------
def save_as_json(intents=INTENTS, path="grocery_intents.json"):
    """Save the dataset in the same {'intents': [...]} JSON shape used by
    the original notebook (so it's a drop-in replacement for intents.json)."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"intents": intents}, f, indent=2, ensure_ascii=False)
    return path


def get_response(tag, intents=INTENTS):
    """Given a predicted tag, return a random friendly response — this is
    the piece that plugs in after your classifier predicts the intent."""
    for intent in intents:
        if intent["tag"] == tag:
            return random.choice(intent["responses"])
    return "Sorry, I didn't quite get that. Could you rephrase your question?"


if __name__ == "__main__":
    dataframe = build_dataframe()
    print(f"Loaded {len(INTENTS)} intents -> {len(dataframe)} pattern rows")
    print(dataframe.head())

    # Quick demo of the reframe/response step
    demo_tag = "delivery_info"
    print(f"\nExample response for tag '{demo_tag}':")
    print(get_response(demo_tag))
