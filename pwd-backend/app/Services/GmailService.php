<?php

namespace App\Services;

use Google\Client;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;
use Illuminate\Support\Facades\Log;

class GmailService
{
    private $client;
    private $service;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setClientId(config('services.google.client_id'));
        $this->client->setClientSecret(config('services.google.client_secret'));
        $this->client->setRedirectUri(config('services.google.redirect_uri'));
        $this->client->setScopes([
            Gmail::GMAIL_SEND,
            Gmail::GMAIL_COMPOSE
        ]);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');

        // Set the refresh token if available
        if (config('services.google.refresh_token')) {
            $this->client->setRefreshToken(config('services.google.refresh_token'));
        }

        $this->service = new Gmail($this->client);
    }

    /**
     * Send an email using Gmail API
     *
     * @param string $to
     * @param string $subject
     * @param string $body
     * @param string $fromEmail
     * @param string $fromName
     * @return bool
     */
    public function sendEmail($to, $subject, $body, $fromEmail = null, $fromName = null)
    {
        try {
            // Use admin email as default sender
            $fromEmail = $fromEmail ?: 'sarinonhoelivan29@gmail.com';
            $fromName = $fromName ?: 'Cabuyao PDAO RMS';

            // Create the email message
            $message = $this->createMessage($to, $subject, $body, $fromEmail, $fromName);
            
            // Send the message
            $sentMessage = $this->service->users_messages->send('me', $message);
            
            Log::info('Gmail API email sent successfully', [
                'message_id' => $sentMessage->getId(),
                'to' => $to,
                'subject' => $subject,
                'from' => $fromEmail
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('Gmail API email sending failed', [
                'error' => $e->getMessage(),
                'to' => $to,
                'subject' => $subject,
                'from' => $fromEmail ?? 'sarinonhoelivan29@gmail.com'
            ]);

            return false;
        }
    }

    /**
     * Create a Gmail message
     *
     * @param string $to
     * @param string $subject
     * @param string $body
     * @param string $fromEmail
     * @param string $fromName
     * @return Message
     */
    private function createMessage($to, $subject, $body, $fromEmail, $fromName)
    {
        $boundary = uniqid(rand(), true);
        
        $rawMessage = "To: {$to}\r\n";
        $rawMessage .= "From: {$fromName} <{$fromEmail}>\r\n";
        $rawMessage .= "Subject: {$subject}\r\n";
        $rawMessage .= "MIME-Version: 1.0\r\n";
        $rawMessage .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n\r\n";
        
        // Add HTML version
        $rawMessage .= "--{$boundary}\r\n";
        $rawMessage .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
        $rawMessage .= $body . "\r\n\r\n";
        
        $rawMessage .= "--{$boundary}--\r\n";

        $message = new Message();
        $message->setRaw(base64_encode($rawMessage));

        return $message;
    }

    /**
     * Get the authorization URL for OAuth2
     *
     * @return string
     */
    public function getAuthUrl()
    {
        return $this->client->createAuthUrl();
    }

    /**
     * Exchange authorization code for access token
     *
     * @param string $code
     * @return array
     */
    public function getAccessToken($code)
    {
        try {
            $accessToken = $this->client->fetchAccessTokenWithAuthCode($code);
            
            if (isset($accessToken['error'])) {
                throw new \Exception('Error fetching access token: ' . $accessToken['error']);
            }

            return $accessToken;
        } catch (\Exception $e) {
            Log::error('Failed to get access token', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Refresh the access token
     *
     * @return array
     */
    public function refreshAccessToken()
    {
        try {
            $accessToken = $this->client->fetchAccessTokenWithRefreshToken();
            
            if (isset($accessToken['error'])) {
                throw new \Exception('Error refreshing access token: ' . $accessToken['error']);
            }

            return $accessToken;
        } catch (\Exception $e) {
            Log::error('Failed to refresh access token', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Check if the service is properly configured
     *
     * @return bool
     */
    public function isConfigured()
    {
        return !empty(config('services.google.client_id')) && 
               !empty(config('services.google.client_secret')) &&
               !empty(config('services.google.refresh_token'));
    }
}
