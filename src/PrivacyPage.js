import Menu from "./Menu";
import Footer from "./Footer";

function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <div className="privacy-policy-title">Privacy Policy</div>
      <div className="privacy-policy-block">
        SpotiGrammy uses the Spotify Web API to retrieve data from your Spotify account. Specifically, this data includes public information about your profile (name, username, profile picture, follower count, public playlists) as well as your top listened-to tracks. The only data used for this web application are the top tracks - this is needed to generate SpotiGrammy nominations.
      </div>
      <div className="privacy-policy-block">
        None of your data is stored, collected, or shared with third parties. The data is solely used to generate the SpotiGrammy graphic.
      </div>
      <div className="privacy-policy-block">
        To remove permissions to retrieve this data, visit <a href="https://www.spotify.com/account/apps/" target="_blank">spotify.com/account</a>.
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
  <div className="main-wrapper">
    <Menu showLogOut={false} />
    <PrivacyPolicy />
    <Footer />
  </div>
  );
}
