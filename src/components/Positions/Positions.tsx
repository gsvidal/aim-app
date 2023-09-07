import "./Positions.scss";

type PositionsProps = {
  token: string;
};

export const Positions: React.FC<PositionsProps> = ({ token }) => {
  return (
    <section className="glass-container">
      <h1>General Ranking</h1>
      <div className="game__arena game__arena--positions">
        <table className="positions__table">
          <thead>
            <tr>
              <th className="positions-head positions-head--name">Name</th>
              <th>Reaction Time {'('}ms{')'}</th>
              <th>Aim {'('}ms{')'}</th>
              <th>Total</th>
              <th className="positions-head positions-head--ranking">
                Ranking
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="positions-data positions-data--name">Papu</td>
              <td className="positions-data">350</td>
              <td className="positions-data">600</td>
              <td className="positions-data">0.97</td>
              <td className="positions-data positions-data--ranking">1</td>
            </tr>
            <tr>
              <td className="positions-data positions-data--name">Pajerico</td>
              <td className="positions-data">450</td>
              <td className="positions-data">500</td>
              <td className="positions-data">0.92</td>
              <td className="positions-data positions-data--ranking">2</td>
            </tr>
            <tr>
              <td className="positions-data positions-data--name">Pajerico</td>
              <td className="positions-data">450</td>
              <td className="positions-data">500</td>
              <td className="positions-data">0.92</td>
              <td className="positions-data positions-data--ranking">2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
