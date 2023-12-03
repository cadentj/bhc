const d1 = (
    <>
        <p>
            The journey begins by articulating your vision for your new home. The most effective approach is to create a comprehensive list categorizing must-haves, needs, and wants. This step is incredibly beneficial as it allows you to streamline your house search with your real estate agent later in the process. [closing sentence]
        </p>
    </>
)

const d2 = (
    <>
        <p>
            Craft a budget with SMART principles in mind—be Specific, Measurable, Attainable, Realistic, and Time-bound. Consider all explicit costs, from fixed expenses to discretionary spending, and maintain a folder for the documents required in the home-buying process. This ensures realistic expectations and informed decision-making as you define your preferences for a new home.
        </p>
    </>
)

const d3 = (
    <>
        <p>
            Before you begin the rest of your journey, if you are looking to qualify for any home finance assistance programs in Boston, you are REQUIRED to take the Boston Home-buying 101 class. This class provides you with critical information that will help you throughout the home buying process. You can find the link to register below.
        </p>
    </>
)

const d4 = (
    <>
        <p>
            Before beginning the next stage, it is important to find and gather all necessary documents like paystubs, bank statements etc. so that the process is a little easier going forward. In general, a good rule to follow is to gather all documents that relate to your financial history and identity.
        </p>
    </>
)

const PreparationContents = [
    {
        "section": "Wants & Needs",
        "description": d1,
        "resources": "None",
        "barriers": "Feeling overwhelmed by down payment value— there are A LOT of down payment assistance programs that exist today. Using the BHC is an awesome resource to explore your options as you move further down the line\nlimited savings"
    },
    {
        "section": "Create Your Budget",
        "description": d2,
        "resources": ["https://www.lowermybills.com/page_assets/static/77a2bfb154e47ddaf0b64ed6f2720612/LMB_WantsVsNeedsVsMustHavesChecklist_Final.pdf"],
        "barriers": "None"
    },
    {
        "section": "Homebuying Education",
        "description": d3,
        "resources": "None",
        "barriers": "Time commitment: It is a long class but the information will help you clear up a lot of questions you may have and also graduating from this class allows you to qualify for a plethora of financial assistance programs!"
    },
    {
        "section": "Gather Documents",
        "description":
            d4,
        "resources": "None",
        "barriers": "Unable to locate or find documents\n\nExigent circumstances not listed may be overwhelming"
    }
]
export { PreparationContents };