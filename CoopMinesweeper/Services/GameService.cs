using Npgsql;
using System;

namespace CoopMinesweeper.Services
{
    public interface IGameService
    {
        string CreateGame(string connectionId, string hostSignal);
        string GetHostSignal(string gameId);
        void JoinGame(string clientSignal, string gameId);
        string CheckPeer(string gameId);
    }

    public class GameService : IGameService
    {
        private const string ConnString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

        public string CreateGame(string connectionId, string hostSignal)
        {
            string newGameId;
            using (var conn = new NpgsqlConnection(ConnString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "CALL create_game(@p, @p2, '')";
                    cmd.Parameters.AddWithValue("p", connectionId);
                    cmd.Parameters.AddWithValue("p2", hostSignal);
                    newGameId = (string)cmd.ExecuteScalar();
                }
            }

            return newGameId;
        }

        public string GetHostSignal(string gameId)
        {
            string hostSignal;
            const string connString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("SELECT host_signal FROM public.games AS g WHERE g.game_id = @p", conn))
                {
                    cmd.Parameters.AddWithValue("p", gameId);
                    hostSignal = (string)cmd.ExecuteScalar();
                }
            }

            return hostSignal;
        }

        public void JoinGame(string clientSignal, string gameId)
        {
            const string connString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("UPDATE public.games SET client_signal = @p, connected_at = @p2 WHERE game_id = @p3", conn))
                {
                    cmd.Parameters.AddWithValue("p", clientSignal);
                    cmd.Parameters.AddWithValue("p2", DateTime.Now);
                    cmd.Parameters.AddWithValue("p3", gameId);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public string CheckPeer(string gameId)
        {
            string clientSignal;
            const string connString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("SELECT client_signal FROM public.games AS g WHERE g.game_id = @p", conn))
                {
                    cmd.Parameters.AddWithValue("p", gameId);
                    clientSignal = (string)cmd.ExecuteScalar();
                }
            }

            return clientSignal;
        }
    }
}
