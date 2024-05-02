// Path src/components/VerifyEmail.tsx:
interface VerifyEmailProps {
    mailType: string;
    token: string;
    
  }
const VerifyEmail:React.FC<VerifyEmailProps> = ({ mailType, token, }) => {
  return (
    <div>
      <p>
        Click on the link below to{" "}
        {mailType === "VERIFY" ? "verify your email" : "reset your password"}
      </p>
      <a
        href={`${process.env.DOMAIN}/${
          mailType === "VERIFY" ? "verify" : "reset"
        }/${token}`}
      >
        Bro, I am testing, don{"'"}t click.
      </a>
    </div>
  );
};

export default VerifyEmail ;
